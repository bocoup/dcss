const { sql, updateQuery } = require('../../../util/sqlHelpers');
const { query } = require('../../../util/db');

exports.getScenarioSlides = async scenarioId => {
  const results = await query(sql`
        SELECT id, title, components, is_finish
        FROM slide
        WHERE scenario_id = ${scenarioId}
        ORDER BY "order";
    `);
  return results.rows;
};

// exports.getCollaboratorSlides = async user_id => {
//   const results = await query(sql`
//     SELECT id, title, components, is_finish
//     FROM slide
//     WHERE scenario_id IN (
//       SELECT scenario.id AS scenario_id
//       FROM scenario
//       JOIN scenario_user_role ON scenario_user_role.scenario_id = scenario.id
//       WHERE deleted_at IS NULL
//       AND scenario_user_role.user_id = ${user_id}
//       AND scenario_user_role.role IN ('owner', 'author')
//     )
//     AND is_finish IS FALSE
//     ORDER BY "order";
//   `);
//   return results.rows;
// };

exports.addSlide = async ({
  scenario_id,
  title,
  components,
  order,
  is_finish = false
}) => {
  let q;
  if (!order) {
    q = sql`
            INSERT INTO slide (scenario_id, title, components, is_finish)
            VALUES (${scenario_id}, ${title}, ${components}, ${is_finish})
            RETURNING *;
        `;
  } else {
    q = sql`
            INSERT INTO slide (scenario_id, title, components, "order", is_finish)
            VALUES (${scenario_id}, ${title}, ${components}, ${order}, ${is_finish})
            RETURNING *;
        `;
  }
  const results = await query(q);
  return results.rows[0];
};

exports.setSlide = async (id, data) => {
  const result = await query(updateQuery('slide', { id }, data));
  return result.rowCount;
};

exports.setAllSlides = async (scenario_id, slides) => {
  const results = await query(sql`
INSERT INTO slide (scenario_id, title, components, is_finish)
    SELECT ${scenario_id} as scenario_id, s.title, s.components, s.is_finish FROM
    jsonb_array_elements(${slides}) AS t(slide),
    jsonb_to_record(t.slide) AS s (id int, title text, components jsonb, is_finish boolean)
    ON CONFLICT DO NOTHING;
    `);
  return { addedCount: results.rowCount };
};

exports.deleteSlide = async (scenario_id, id) => {
  const result = await query(
    sql`DELETE FROM slide WHERE id=${id} and scenario_id=${scenario_id}`
  );
  return result.rowCount;
};

exports.setSlideOrder = async (scenario_id, slide_ids) => {
  const results = await query(
    sql`
WITH n (slide_id, new_order) as (SELECT jsonb_array_elements_text(${slide_ids}), generate_series(100, 10000000, 10))
UPDATE slide SET "order" = n.new_order
    FROM N
    WHERE scenario_id = ${scenario_id}
        AND id = n.slide_id::int;
`
  );
  return results.rowCount;
};
