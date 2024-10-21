const jwt = require("jsonwebtoken");
const databases = require("../config/database/databases");

const createTokens = async (payload) => {
  try {
    const accessToken = jwt.sign(
      {
        id: payload.id,
        email: payload.email,
        role: payload.role,
      },
      process.env.ACCESS_JWT_SECRET
      // {
      //   expiresIn: "1h",
      // }
    );

    const refreshToken = jwt.sign(
      { id: payload.id },
      process.env.REFRESH_JWT_SECRET
    );
    const isAlreadyRefreshToken = await databases.refreshTokens.findOne({
      where: { _user: payload.id },
    });
    if (isAlreadyRefreshToken) {
      await databases.refreshTokens.update(
        {
          refreshToken: refreshToken,
        },
        {
          where: {
            _user: payload.id,
          },
        }
      );
    } else {
      await databases.refreshTokens.create({
        _user: payload.id,
        refreshToken: refreshToken,
      });
    }
    const data = {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
    return data;
  } catch (error) {
    console.log(error);
  }
};

module.exports = createTokens;
