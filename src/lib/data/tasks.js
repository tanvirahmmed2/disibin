import { dbQuery } from "../database/pg";

export async function getTasks(role, userId) {
    let query = `
        SELECT t.*, 
               u.name as assigned_to_name, u.image as assigned_to_image,
               c.name as created_by_name, c.image as created_by_image
        FROM tasks t
        LEFT JOIN users u ON t.assigned_to = u.user_id
        LEFT JOIN users c ON t.created_by = c.user_id
    `;
    let params = [];

    // Managers and admins can see all tasks, or we can restrict managers to tasks they created.
    // Assuming 'admin' and 'manager' see all tasks for now, as typical in such systems.
    if (role === 'developer' || role === 'support') {
        query += ` WHERE t.assigned_to = $1 OR t.created_by = $1`;
        params.push(userId);
    }

    query += ` ORDER BY t.created_at DESC`;

    const res = await dbQuery(query, params);
    return res.rows;
}

export async function getTaskById(taskId) {
    const query = `
        SELECT t.*, 
               u.name as assigned_to_name, u.image as assigned_to_image, u.role as assigned_to_role,
               c.name as created_by_name, c.image as created_by_image, c.role as created_by_role
        FROM tasks t
        LEFT JOIN users u ON t.assigned_to = u.user_id
        LEFT JOIN users c ON t.created_by = c.user_id
        WHERE t.task_id = $1
    `;
    const res = await dbQuery(query, [taskId]);
    return res.rows[0] || null;
}

export async function createTask(data) {
    const { title, description, assigned_to, created_by, project_id, status = 'pending', priority = 'medium', due_date } = data;
    
    // Project ID is optional
    const projectVal = project_id ? project_id : null;
    const dueDateVal = due_date ? due_date : null;

    const query = `
        INSERT INTO tasks (title, description, assigned_to, created_by, project_id, status, priority, due_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
    `;
    const res = await dbQuery(query, [title, description, assigned_to, created_by, projectVal, status, priority, dueDateVal]);
    return res.rows[0];
}

export async function updateTaskStatus(taskId, status) {
    const query = `
        UPDATE tasks 
        SET status = $1, updated_at = now() 
        WHERE task_id = $2 
        RETURNING *
    `;
    const res = await dbQuery(query, [status, taskId]);
    return res.rows[0];
}

export async function getTaskMessages(taskId) {
    const query = `
        SELECT tm.*, u.name as user_name, u.image as user_image, u.role as user_role
        FROM task_messages tm
        JOIN users u ON tm.user_id = u.user_id
        WHERE tm.task_id = $1
        ORDER BY tm.created_at ASC
    `;
    const res = await dbQuery(query, [taskId]);
    return res.rows;
}

export async function addTaskMessage(taskId, userId, message) {
    const query = `
        INSERT INTO task_messages (task_id, user_id, message)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    const res = await dbQuery(query, [taskId, userId, message]);
    
    // Fetch the inserted message with user details to return
    const fetchQuery = `
        SELECT tm.*, u.name as user_name, u.image as user_image, u.role as user_role
        FROM task_messages tm
        JOIN users u ON tm.user_id = u.user_id
        WHERE tm.message_id = $1
    `;
    const fetchRes = await dbQuery(fetchQuery, [res.rows[0].message_id]);
    return fetchRes.rows[0];
}
