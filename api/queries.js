module.exports = {
  INSERT_EMAIL_AUTH: `
            INSERT INTO TBL_EMAIL_AUTH( UUID , EMAIL , CONFM_YN , EXPIRE_DATE ) 
        VALUES 
        ( :UUID
        , :EMAIL
        , 'N' 
        , DATE_FORMAT(:EXPIRE_DATE, '%Y-%m-%d %H:%i:%s')
        )
    `,
};
