const { USER_TABLE, AUTH_TABLE } = process.env;

/*

-[USER_TABLE]
--USER_SEQ: ID (PK)
--USER_ID: EMAIL (=User ID, UNIQUE)

-[AUTH_TABLE]
--UUID: ID (PK)
--EMAIL: user's email(=User ID, Must be in mail format)
--CONFM_YN: 'Y', 'N' CHECK TO CONFIRM AUTH
--EXPIRE_DATE: Validity Period

*/

module.exports = {
  // Redundant verification
  SELECT_USER_ID_EXISTS: `
        SELECT USER_SEQ, USER_ID
        FROM ${USER_TABLE}
        WHERE USER_ID = :USER_ID
    `,
  // 업데이트 결과가 0이면 인증되지 않음
  UPDATE_EMAIL_AUTH: `
        UPDATE ${AUTH_TABLE} SET CONFM_YN = 'Y'
        WHERE UUID = :UUID
        AND EXPIRE_DATE >= SYSDATE() 
    `,

  SELECT_EMAIL_AUTH_CONFM: `
        SELECT UUID, EMAIL, CONFM_YN
        FROM ${AUTH_TABLE}
        WHERE UUID = :UUID
        AND EMAIL = :EMAIL
        AND CONFM_YN = 'Y'
    `,
};
