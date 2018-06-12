var preload = function(game) {};

preload.prototype = {
  preload: function() {
    var loadingBar = this.game.add.sprite(this.game.width / 2 - 120, this.game.height / 2 + 100, 'loading');
    loadingBar.anchor.setTo(0, 0.5);

    this.game.load.setPreloadSprite(loadingBar);
    var loadingText = this.game.add.bitmapText(this.game.width / 2, this.game.height / 2, 'ds_digital', 'loading', 72);
    loadingText.anchor.setTo(0.5, 0);

    this.game.load.spritesheet('cards', 'assets/img/cells.png', 120, 120, 12);

  },

  create: function() {
    this.game.stage.backgroundColor = "#FFFFFF";
    this.game.state.start('Game');
  }
};
