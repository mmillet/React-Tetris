class Audio {
  constructor() {
    this.bgm = (() => {
      var bgms = [
        new Howl({
          urls: ['/audio/bgm1.ogg'],
          loop: true,
          volume: 0.3
        }),
        new Howl({
          urls: ['/audio/bgm2.ogg'],
          loop: true,
          volume: 0.3
        })
      ];
      return {
        play: () => bgms[Math.floor(Math.random() * 2)].play(),
        stop: () => bgms.map(m => m.stop())
      }
    })();
    this.spin = new Howl({
      urls: ['/audio/spin.wav']
    });
    this.bottom = new Howl({
      urls: ["/audio/bottom.wav"]
    });
    this.btn = new Howl({
      urls: ["/audio/btn.wav"]
    });
    this.die = new Howl({
      urls: ["/audio/lost.wav"]
    });
    this.readyGo = new Howl({
      urls: ["/audio/readyGo.wav"]
    });
    this.destroy = new Howl({
      urls: ["/audio/destroy.wav"]
    });
  }
  playBgm() {
    !this.isMute && this.bgm.play();
  }
  stopBgm() {
    this.bgm.stop();
  }
  playSpin() {
    !this.isMute && this.spin.play();
  }
  playBottom() {
    !this.isMute && this.bottom.play();
  }
  playBtn() {
    !this.isMute && this.btn.play();
  }
  playDestroy() {
    !this.isMute && this.destroy.play();
  }
  playDie() {
    !this.isMute && this.die.play();
  }
  playReadyGo() {
    !this.isMute && this.readyGo.play();
  }
  mute() {
    this.isMute = true;
    this.bgm.stop();
  }
  unmute() {
    this.isMute = false;
  }
}

export default Audio;