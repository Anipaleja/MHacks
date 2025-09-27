@component
export class DartBoardController extends BaseScriptComponent {

    @input
    public dartHitSounds:AudioComponent
    @input
    public dartBouncedSound:AudioComponent


    onAwake() {
        this.dartHitSounds.playbackMode = Audio.PlaybackMode.LowLatency
        this.dartBouncedSound.playbackMode = Audio.PlaybackMode.LowLatency
    }

    public playDartHitSound() {
        this.dartHitSounds.play(1)
    }   

    public playDartBouncedSound() {
        this.dartBouncedSound.play(1)
    }
}
