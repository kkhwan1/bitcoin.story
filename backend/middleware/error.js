export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: '입력값이 올바르지 않습니다.',
      errors: Object.values(err.errors).map(error => error.message)
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: '유효하지 않은 토큰입니다.'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: '토큰이 만료되었습니다.'
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      message: '중복된 데이터가 존재합니다.'
    });
  }

  res.status(500).json({
    message: '서버 오류가 발생했습니다.'
  });
};

export const notFound = (req, res) => {
  res.status(404).json({
    message: '요청하신 리소스를 찾을 수 없습니다.'
  });
}; 