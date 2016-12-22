module.exports = {
  index( req, res ){
    var bottles = req.params.numberOfBottles || 99;
    var next = bottles - 1;
    res.render('index', { bottles, next });
  }
};
