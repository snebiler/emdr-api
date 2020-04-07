const ErrorResponse = require('../utils/errorResponse');
/**
 * Middleware controllerdaki error objeleri buraya nextleniyor
 * Bu da error başlıklarını ayırıp messageları başlıklara atıyor
 * Sonra errorları güzel bi custom ErrorResponse sınıfıyla iletiyor
 * Ekrana da ayıklanmış mesajı dönüyor
 *
 */
const errorHandler = (err, req, res, next) => {
    // console.log(err);
  // errorları bi objede toplayip asagida kullanicaz yoksa her tip icin ayrı if yazmakgerekirdi
  let error = { ...err };
  error.message = err.message;

  // Log to consel for devoloper
  console.log(`${'ERROR HANDLER--->>'} ${err}`);

  /**
   * Mongodb nin kendine özel hataları ve kodları var
   * sık kullanılanlara özel if yazmak kolay oluyormuş
   */
  // Mongoose bad object id
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose dublacate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }
  // Mongoose Validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(value => value.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'server error'
  });
};
module.exports = errorHandler;
