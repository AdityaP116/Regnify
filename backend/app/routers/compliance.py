"""
Compliance Tasks router

GET  /api/compliance/tasks        — list all tasks for the current user
POST /api/compliance/tasks        — create a new task
PUT  /api/compliance/tasks/{id}   — update task status/progress
"""

from __future__ import annotations
import time
from fastapi import APIRouter, Depends

from app.auth import require_auth
from app.models import ComplianceTask, CreateTaskRequest, UpdateTaskRequest
from app.services.firebase import col_list, col_query, doc_set, doc_update, is_firebase_ok
from app.services.seed import get_corpus

router = APIRouter(prefix="/api", tags=["Compliance"])


def _tasks_from_seed() -> list[ComplianceTask]:
    corpus = get_corpus()
    return [ComplianceTask(**t) for t in corpus.get("complianceTasks", [])]


@router.get("/compliance/tasks", response_model=list[ComplianceTask])
async def list_tasks(uid: str = Depends(require_auth)) -> list[ComplianceTask]:
    """Return compliance tasks for the current user."""
    if is_firebase_ok():
        # Try user-scoped tasks first
        docs = col_query("complianceTasks", "uid", "==", uid)
        if not docs:
            # Fall back to business-level tasks (seed data)
            docs = col_list("complianceTasks")
        result = []
        for d in docs:
            try:
                result.append(ComplianceTask(**d))
            except Exception:
                pass
        if result:
            return result

    return _tasks_from_seed()


@router.post("/compliance/tasks", response_model=ComplianceTask, status_code=201)
async def create_task(
    payload: CreateTaskRequest,
    uid: str = Depends(require_auth),
) -> ComplianceTask:
    """Create a new compliance task."""
    task_id = f"task-{int(time.time())}"
    initials = (
        payload.ownerInitials
        or "".join(p[0].upper() for p in (payload.assignedTo or "EV").split()[:2])
    )
    task = ComplianceTask(
        id=task_id,
        title=payload.title,
        regulationId=payload.regulationId or "reg-dish-cr-88",
        regulationRef=payload.regulationRef or "",
        status="pending",
        priority=payload.priority,
        assignedTo=payload.assignedTo or "Elena Vance",
        ownerInitials=initials,
        dueDate=payload.dueDate or "",
        primaryCategory=payload.primaryCategory or "",
        actions=payload.actions or "",
        progress=0,
    )

    if is_firebase_ok():
        doc_set("complianceTasks", task_id, {**task.model_dump(), "uid": uid})

    return task


@router.put("/compliance/tasks/{task_id}", response_model=ComplianceTask)
async def update_task(
    task_id: str,
    payload: UpdateTaskRequest,
    uid: str = Depends(require_auth),
) -> ComplianceTask:
    """Update the status and/or progress of a compliance task."""
    update_data: dict = {"status": payload.status}
    if payload.progress is not None:
        update_data["progress"] = payload.progress
    elif payload.status == "completed":
        update_data["progress"] = 100

    if is_firebase_ok():
        doc_update("complianceTasks", task_id, update_data)
        from app.services.firebase import doc_get
        doc = doc_get("complianceTasks", task_id)
        if doc:
            try:
                return ComplianceTask(**doc)
            except Exception:
                pass

    # Fallback to seed corpus or memory update
    corpus = get_corpus()
    tasks = corpus.get("complianceTasks", [])
    base = next((t for t in tasks if t["id"] == task_id), None)
    if base:
        base.update(update_data)
        return ComplianceTask(**base)

    # If task not found in seed array, create synthetic updated representation
    synthetic = {
        "id": task_id,
        "title": "Compliance Task",
        "regulationId": "reg-dish-cr-88",
        "regulationRef": "DISH/2025/CR-88",
        "status": payload.status,
        "priority": "high",
        "assignedTo": "Elena Vance",
        "ownerInitials": "EV",
        "dueDate": "30 Oct 2025",
        "primaryCategory": "Industrial Safety",
        "actions": "",
        "progress": update_data.get("progress", 100 if payload.status == "completed" else 0),
    }
    return ComplianceTask(**synthetic)

