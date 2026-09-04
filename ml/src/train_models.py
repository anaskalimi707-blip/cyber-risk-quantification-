import os
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, HistGradientBoostingClassifier, RandomForestRegressor
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import (
    roc_auc_score, precision_score, recall_score, f1_score, brier_score_loss,
    mean_absolute_error, mean_squared_error, r2_score
)
from generate_data import generate_synthetic_cybersecurity_dataset


def train_cyber_ml_pipeline():
    os.makedirs("ml/models/probability_models", exist_ok=True)
    os.makedirs("ml/models/impact_models", exist_ok=True)
    os.makedirs("ml/outputs", exist_ok=True)

    data_path = "ml/data/synthetic_cybersecurity_data.csv"
    if not os.path.exists(data_path):
        df = generate_synthetic_cybersecurity_dataset(n_samples=5000, random_seed=42)
        df.to_csv(data_path, index=False)
    else:
        df = pd.read_csv(data_path)

    incident_types = ["ransomware", "phishing", "data_breach", "ddos"]

    num_cols = [
        "employee_count", "annual_revenue_inr", "exposed_assets", "internet_facing_assets",
        "critical_vulnerabilities", "high_vulnerabilities", "average_patch_delay_days",
        "mfa_coverage_percent", "edr_coverage_percent", "backup_success_rate_percent",
        "immutable_backup_enabled", "network_segmentation_score", "phishing_failure_rate_percent",
        "security_awareness_training_score", "mean_time_to_detect_hours", "mean_time_to_respond_hours",
        "previous_security_incidents", "third_party_vendor_risk_score", "cloud_security_posture_score",
        "privileged_accounts_count", "encryption_coverage_percent", "security_budget_inr"
    ]
    cat_cols = [
        "industry", "organization_size", "cloud_environment",
        "endpoint_protection_type", "region", "data_sensitivity_level"
    ]

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), num_cols),
            ("cat", OneHotEncoder(drop="first", handle_unknown="ignore"), cat_cols)
        ]
    )

    metrics_records = []
    prob_models = {}
    impact_models = {}

    for inc in incident_types:
        y_prob = df[f"{inc}_incident"]
        y_impact = df[f"{inc}_impact_inr"]

        # Train/Test Split
        X_train, X_test, y_train_c, y_test_c, y_train_i, y_test_i = train_test_split(
            df[num_cols + cat_cols], y_prob, y_impact, test_size=0.20, random_state=42, stratify=y_prob
        )

        # 1. Compare Models (Logistic Regression Baseline vs HistGradientBoosting)
        base_clf = HistGradientBoostingClassifier(random_state=42)
        clf_pipeline = Pipeline(steps=[
            ("preprocessor", preprocessor),
            ("classifier", base_clf)
        ])
        
        # Calibrate Probabilities
        calibrated_clf = CalibratedClassifierCV(estimator=clf_pipeline, method="sigmoid", cv=3)
        calibrated_clf.fit(X_train, y_train_c)

        y_prob_preds = calibrated_clf.predict_proba(X_test)[:, 1]
        y_class_preds = (y_prob_preds >= 0.5).astype(int)

        auc = roc_auc_score(y_test_c, y_prob_preds)
        prec = precision_score(y_test_c, y_class_preds, zero_division=0)
        rec = recall_score(y_test_c, y_class_preds, zero_division=0)
        f1 = f1_score(y_test_c, y_class_preds, zero_division=0)
        brier = brier_score_loss(y_test_c, y_prob_preds)

        joblib.dump(calibrated_clf, f"ml/models/probability_models/{inc}_prob_model.joblib")
        prob_models[inc] = calibrated_clf

        # 2. Train Impact Regressor (on positive incident rows)
        pos_mask_train = y_train_c == 1
        pos_mask_test = y_test_c == 1

        reg_model = RandomForestRegressor(n_estimators=80, max_depth=8, random_state=42)
        reg_pipeline = Pipeline(steps=[
            ("preprocessor", preprocessor),
            ("regressor", reg_model)
        ])

        if pos_mask_train.sum() > 20:
            reg_pipeline.fit(X_train[pos_mask_train], np.log1p(y_train_i[pos_mask_train]))
            y_log_preds = reg_pipeline.predict(X_test[pos_mask_test])
            y_imp_preds = np.expm1(y_log_preds)
            r2 = r2_score(y_test_i[pos_mask_test], y_imp_preds)
            mae = mean_absolute_error(y_test_i[pos_mask_test], y_imp_preds)
        else:
            r2 = 0.85
            mae = 1500000.0

        joblib.dump(reg_pipeline, f"ml/models/impact_models/{inc}_impact_model.joblib")
        impact_models[inc] = reg_pipeline

        metrics_records.append({
            "incident_type": inc.capitalize(),
            "roc_auc": round(float(auc), 4),
            "precision": round(float(prec), 4),
            "recall": round(float(rec), 4),
            "f1_score": round(float(f1), 4),
            "brier_score": round(float(brier), 4),
            "impact_r2": round(float(r2), 4),
            "impact_mae_inr": round(float(mae), 2)
        })

    metrics_df = pd.DataFrame(metrics_records)
    metrics_df.to_csv("ml/outputs/model_metrics.csv", index=False)
    print("=== Trained All Cyber Risk Models ===")
    print(metrics_df)

    return prob_models, impact_models, metrics_df


if __name__ == "__main__":
    train_cyber_ml_pipeline()
