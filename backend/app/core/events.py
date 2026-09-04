import asyncio
from typing import Callable, Dict, List, Any
from app.core.logging import logger


class EventBus:
    def __init__(self):
        self._subscribers: Dict[str, List[Callable[[Dict[str, Any]], Any]]] = {}

    def subscribe(self, event_type: str, handler: Callable[[Dict[str, Any]], Any]):
        if event_type not in self._subscribers:
            self._subscribers[event_type] = []
        self._subscribers[event_type].append(handler)

    async def publish(self, event_type: str, payload: Dict[str, Any]):
        logger.info(f"Publishing event: {event_type}")
        if event_type in self._subscribers:
            for handler in self._subscribers[event_type]:
                try:
                    if asyncio.iscoroutinefunction(handler):
                        await handler(payload)
                    else:
                        handler(payload)
                except Exception as e:
                    logger.error(f"Error handling event {event_type}: {e}", exc_info=True)


event_bus = EventBus()
