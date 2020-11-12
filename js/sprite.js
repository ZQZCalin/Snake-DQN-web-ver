var Sprite = function(fname) {

    // Static Variables
    var TO_RADIAN = Math.PI/180;

    // Instance Variables
    this.image = null;
    if (fname != undefined && fname != '' && fname != null) {
        this.image = new Image();
        this.image.src = fname;
        //console.log([this.image.width, this.image.height]);
    } else {
      console.log('cannot load file');
    }

    // Instance Methods

    // draw: start from top-left point
    this.draw = function(ctx, x, y, w, h) {
      // ctx.context.scale(ctx.dpr, ctx.dpr);
      if (w == undefined || h == undefined) {
        ctx.drawImage(this.image, x, y);
      } else {
        ctx.drawImage(this.image, x, y, w, h);
      }
    };

    // rotate image: from center of the image
    this.rotate = function(ctx, x, y, angle) {
      ctx.save();
      ctx.scale(ctx.dpr, ctx.dpr);
      ctx.translate(x, y);
      ctx.rotate(angle * this.TO_RADIAN);
      ctx.drawImage(this.image, -this.image.width/2, -this.image.height/2);
      ctx.restore();
    };
};
