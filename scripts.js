import * as muxjs from 'mux.js';
import shaka from 'shaka-player';

if(!window.muxjs){
    window.muxjs = muxjs;
}

document.addEventListener('DOMContentLoaded', () => {
    const playerElement = document.getElementById('playerElement');
    const errorElement = document.getElementById('errorElement');
    const playerElement2 = document.getElementById('playerElement2');
    const errorElement2 = document.getElementById('errorElement2');

    // Start the first player at 0
    new ShakaPlayer(playerElement, errorElement, 0);

    // Start the second player at 20
    new ShakaPlayer(playerElement2, errorElement2,20);
});

class ShakaPlayer {
    constructor(playerElement, errorElement, startTime){
        this.playerElement = playerElement;
        this.hlsManifestUrl = this.playerElement.dataset['hlsManifest'];
        this.errorElement = errorElement;
        this.startTime = startTime;
        let shakaPlayer;

        shaka.polyfill.installAll();

        if (shaka.Player.isBrowserSupported()) {
            shakaPlayer = new shaka.Player();

            shakaPlayer.addEventListener('error', (error) => {
                console.error(error);
                this.appendErrors(error.detail.data);
            });

            shakaPlayer.attach(playerElement)
                .then(() => {
                    shakaPlayer.configure({
                        abr: {
                            restrictions: {
                                maxHeight: window.screen.height,
                            },
                        },
                        streaming: {
                            bufferingGoal: 150,
                            ignoreTextStreamFailures: true,
                        },
                    });

                    shakaPlayer.load(
                        this.hlsManifestUrl,
                        this.startTime,
                        'application/x-mpegURL',
                    )
                        .catch((error) => {
                            console.error(error);
                            this.appendErrors(error.detail.data);
                        });
                })
                .catch((error) => {
                    console.error(error);
                    this.appendErrors(error.detail.data);
                });
        }
    }

    appendErrors(errors){
        errors.forEach((error) => {
            const element = document.createElement('li');
            element.innerHTML = error;

            console.log(error);

            this.errorElement.appendChild(element);
        });
    }
}
