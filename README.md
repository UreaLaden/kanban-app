# kanban server

### Server is live at <a href="https://kanban-app-server-main.onrender.com"/>Render.com</a>

## Endpoints

- Add TaskBoard : ```POST: /taskboard ```

### Response:
```
{
    "id": "6606b2f962769fe2a2c68c4b",
    "name": "A New Testing Board",
    "columns": [
        "6606b2f962769fe2a2c68c4d",
        "6606b2f962769fe2a2c68c4f",
        "6606b2f962769fe2a2c68c51"
    ]
}
```
- Get All TaskBoards : ```GET: /taskboard```
### Response:
```
[
    {
        "_id": "6606b2d662769fe2a2c68b45",
        "name": "Platform Launch",
        "columns": [
            "6606b2d662769fe2a2c68b47",
            "6606b2d762769fe2a2c68b6e",
            "6606b2d862769fe2a2c68bb3"
        ],
        "__v": 0
    },
    {
        "_id": "6606b2d862769fe2a2c68bef",
        "name": "Marketing Plan",
        "columns": [
            "6606b2d862769fe2a2c68bf1",
            "6606b2d962769fe2a2c68c24",
            "6606b2d962769fe2a2c68c27"
        ],
        "__v": 0
    },
    {
        "_id": "6606b2d962769fe2a2c68c2a",
        "name": "Roadmap",
        "columns": [
            "6606b2d962769fe2a2c68c2c",
            "6606b2d962769fe2a2c68c44",
            "6606b2d962769fe2a2c68c47"
        ],
        "__v": 0
    }
]
```
- Get Board By Id: ```GET: /taskboard/:boardId```
### Response:

```
{
    "_id": "6606b2d662769fe2a2c68b45",
    "name": "Platform Launch",
    "columns": [
        "6606b2d662769fe2a2c68b47",
        "6606b2d762769fe2a2c68b6e",
        "6606b2d862769fe2a2c68bb3"
    ],
    "__v": 0
}
```

- Delete TaskBoard: ```DELETE: /taskboard/board/:boardId```
### Response

```
TaskBoard and related objects deleted successfully
```
- Get All Tasks by Board Id: ```GET: /taskboard/:boardId/tasks```

### Response
```
[
    {
        "id": "6606b2d862769fe2a2c68bf4",
        "title": "Plan Product Hunt launch",
        "description": "",
        "status": "Todo",
        "subtasks": [
            {
                "id": "6606b2d862769fe2a2c68bf7",
                "title": "Find hunter",
                "isCompleted": false,
                "task": "6606b2d862769fe2a2c68bf4"
            },
            {
                "id": "6606b2d862769fe2a2c68bfa",
                "title": "Gather assets",
                "isCompleted": false,
                "task": "6606b2d862769fe2a2c68bf4"
            },
       ...
        ],
        "column": "6606b2d862769fe2a2c68bf1"
    },
   ...
]
```

- Add Task: ```POST: /taskboard/:boardId/tasks```

### Response

```
{
    "id": "6606b65a62769fe2a2c68c6c",
    "title": "Implement new feature",
    "description": "We need to implement the new feature as described in the requirements document. This includes both frontend and backend changes.",
    "status": "Todo",
    "subtasks": [
        {
            "title": "Frontend implementation",
            "isCompleted": false
        },
        {
            "title": "Backend implementation",
            "isCompleted": false
        }
    ],
    "column": "6605e975d67a00628b6743e7"
}
```
- Delete Task: ```DELETE: /taskboard/task/:taskId```
### Response

```
Task and related objects deleted successfully
```