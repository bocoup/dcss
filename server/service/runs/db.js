const { sql, updateQuery } = require('../../util/sqlHelpers');
const { query, withClientTransaction } = require('../../util/db');

exports.getRunById = async function(id) {
  const result = await query(sql`
        SELECT * FROM run
        WHERE id=${id};
    `);
  return result.rows[0];
};

exports.getRuns = async function(user_id) {
  const result = await query(sql`
        SELECT
            run.id as id,
            run.id as run_id,
            run.created_at as run_created_at,
            run.ended_at as run_ended_at,
            consent_acknowledged_by_user,
            consent_granted_by_user,
            cohort_run.cohort_id as cohort_id,
            scenario.id as scenario_id,
            scenario.title as scenario_title,
            scenario.description as scenario_description,
            scenario.id as scenario_id,
            run.user_id as user_id
        FROM run
        JOIN scenario ON scenario.id = run.scenario_id
        LEFT JOIN cohort_run ON cohort_run.run_id = run.id
        WHERE run.user_id = ${user_id}
        ORDER BY run.created_at DESC;
    `);
  return result.rows;
};

exports.getRunByIdentifiers = async function(
  user_id,
  { scenario_id, cohort_id }
) {
  let lookup = `
    SELECT * FROM run_view
    WHERE ended_at IS NULL
    AND user_id = ${user_id}
    AND scenario_id = ${scenario_id}
  `;

  if (cohort_id) {
    lookup += `AND cohort_id = ${cohort_id}`;
  } else {
    lookup += `AND cohort_id IS NULL`;
  }

  const result = await query(lookup);

  return result.rows[0];
};

exports.createRun = async function(user_id, scenario_id, consent_id) {
  const result = await query(sql`
    INSERT INTO run (scenario_id, user_id, consent_id)
    VALUES (${scenario_id}, ${user_id}, ${consent_id})
    RETURNING *;
  `);
  return result.rows[0];
};

exports.updateRun = async function(id, data) {
  const result = await query(updateQuery('run', { id }, data));
  return result.rows[0];
};

exports.saveRunEvent = async (run_id, name, context) => {
  return await withClientTransaction(async client => {
    const result = await client.query(sql`
      INSERT INTO run_event (run_id, name, context)
      VALUES (${run_id}, ${name}, ${context})
      ON CONFLICT DO NOTHING
      RETURNING *;
    `);
    return result.rows[0];
  });
};

async function updateResponse(id, data) {
  const result = await query(updateQuery('run_response', { id }, data));
  return result.rows[0];
}

exports.updateResponse = updateResponse;

exports.getResponse = async ({ run_id, response_id, user_id }) => {
  const result = await query(sql`
        SELECT * FROM run_response
        WHERE response_id = ${response_id}
        AND run_id = ${run_id}
        AND user_id = ${user_id}
        ORDER BY created_at DESC
        LIMIT 1;
    `);
  return result.rows[0];
};

async function getLastResponseOrderedById({ run_id, response_id, user_id }) {
  const result = await query(sql`
      SELECT * FROM run_response
      WHERE response_id = ${response_id}
      AND run_id = ${run_id}
      AND user_id = ${user_id}
      ORDER BY id DESC
      LIMIT 1;
  `);
  return result.rows[0];
}

exports.getLastResponseOrderedById = getLastResponseOrderedById;

async function upsertResponse({
  run_id,
  response_id,
  response,
  user_id,
  created_at,
  ended_at
}) {
  const previous = await getLastResponseOrderedById({
    run_id,
    response_id,
    user_id
  });

  if (previous && !previous.response.value) {
    return await updateResponse(previous.id, {
      response: {
        ...previous.response,
        ...response
      }
    });
  }

  const result = await query(sql`
    INSERT INTO run_response (run_id, response_id, response, user_id, created_at, ended_at)
    VALUES (${run_id}, ${response_id}, ${response}, ${user_id}, ${created_at}, ${ended_at})
    RETURNING *;
  `);
  return result.rows[0];
}

exports.upsertResponse = upsertResponse;

exports.getRunResponses = async run_id => {
  const result = await query(sql`
    SELECT
      run.user_id as user_id,
      username,
      run.id as run_id,
      run.scenario_id as scenario_id,
      run.referrer_params as referrer_params,
      response_id,
      run_response.response->>'value' as value,
      run_response.response->>'content' as content,
      audio_transcripts.transcript as transcript,
      CASE run_response.response->>'isSkip' WHEN 'false' THEN FALSE
          ELSE TRUE
      END as is_skip,
      run_response.response->>'type' as type,
      run_response.created_at as created_at,
      run_response.ended_at as ended_at,
      run.consent_granted_by_user,
      cohort_run.cohort_id
    FROM run_response
    JOIN run ON run.id = run_response.run_id
    JOIN users ON users.id = run.user_id
    LEFT JOIN cohort_run ON cohort_run.run_id = run_response.run_id
    LEFT JOIN audio_transcripts ON audio_transcripts.key = run_response.response->>'value'
    WHERE run_response.run_id = ${run_id}
    ORDER BY run_response.id ASC
  `);

  return result.rows;
};

exports.getResponses = async ({ run_id, user_id }) => {
  const result = await query(sql`
    SELECT * FROM run_response
    WHERE run_id = ${run_id}
    AND user_id = ${user_id}
    ORDER BY created_at DESC;
  `);
  return result.rows;
};

exports.getResponseTranscript = async ({ run_id, response_id, user_id }) => {
  // const result = await query(sql`
  //   SELECT transcript
  //   FROM audio_transcript
  //   JOIN (
  //     SELECT response->>'value' as audio_key
  //     FROM run_response
  //     WHERE response_id = ${response_id}
  //     AND run_id = ${run_id}
  //     AND user_id = ${user_id}
  //     ORDER BY created_at DESC
  //     LIMIT 1
  //   ) AS audio_keys ON audio_keys.audio_key = audio_transcript.key
  //   WHERE replaced_at IS NULL
  // `);
  // return result.rows[0];

  return exports.getTranscriptionOutcome({ run_id, response_id, user_id });
};

exports.getTranscriptionOutcome = async ({ run_id, response_id, user_id }) => {
  const likable = `%audio/${run_id}/${response_id}/${user_id}/%`;
  const result = await query(sql`
    SELECT response, transcript
    FROM audio_transcripts
    WHERE key ILIKE ${likable}
  `);

  return result.rows[0];
};

exports.finishRun = async function(id) {
  const result = await query(sql`
    UPDATE run
    SET ended_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *;
  `);
  return result.rows[0];
};
