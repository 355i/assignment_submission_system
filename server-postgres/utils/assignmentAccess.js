// utils/assignmentAccess.js
/**
 * 根据用户角色和作业ID查询作业信息，支持自定义查询字段
 * @param {Pool} pool - 数据库连接池
 * @param {number} assignmentId - 作业ID
 * @param {object} user - 用户对象，包含 id 和 role
 * @param {string[]} fields - 需要查询的字段列表，默认 ['*']
 * @returns {object|null} 查询结果对象 或 null 表示无权限或不存在
 */
export async function checkUserAssignmentAccess(pool, assignmentId, user, fields = ['*']) {
    const { id: userId, role } = user;

    // 字段安全处理，防止SQL注入，确保字段名是字母数字和下划线
    const safeFields =
        fields.length === 1 && fields[0] === '*'
            ? '*'
            : fields.map(f => f.replace(/[^a-zA-Z0-9_]/g, '')).join(',');


    let query = '';
    let params = [assignmentId, userId];

    if (role === 'student') {
        query = `
      SELECT a.${safeFields}
      FROM assignment_set a
      JOIN course_student cs ON a.course_id = cs.course_id
      WHERE a.id = $1 AND cs.student_id = $2
    `;
    } else if (role === 'teacher') {
        query = `
      SELECT a.${safeFields}
      FROM assignment_set a
      JOIN course_teacher ct ON a.course_id = ct.course_id
      WHERE a.id = $1 AND ct.teacher_id = $2
    `;
    } else {
        throw new Error('Unauthorized role');
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
}
