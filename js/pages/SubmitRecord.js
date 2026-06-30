import Btn from '../components/Btn.js';

const SUBMIT_EMAIL = 'thenicalistoficial@gmail.com';

export default {
    components: { Btn },
    template: `
        <main class="page-submit-record">
            <div class="submit-record-container">
                <h1>Submit a Record</h1>
                <p class="type-body submit-record-description">
                    Fill out the form below to submit your record for review.
                </p>
                <form class="submit-record-form" @submit.prevent="onSubmit">
                    <label class="type-label-lg" for="player-name">Player name</label>
                    <input
                        id="player-name"
                        type="text"
                        v-model="playerName"
                        placeholder="Your in-game name"
                        required
                    />

                    <label class="type-label-lg" for="level-name">Completed level</label>
                    <input
                        id="level-name"
                        type="text"
                        v-model="levelName"
                        placeholder="Level name"
                        required
                    />

                    <label class="type-label-lg" for="video-link">Video link</label>
                    <input
                        id="video-link"
                        type="url"
                        v-model="videoLink"
                        placeholder="https://"
                        required
                    />

                    <div class="check">
                        <input
                            type="checkbox"
                            id="on-platform"
                            v-model="onPlatform"
                        />
                        <label for="on-platform" class="type-label-lg">
                            I'm on AREDL or Pointercrate
                        </label>
                    </div>

                    <template v-if="!onPlatform">
                        <label class="type-label-lg" for="raw-footage">Raw footage</label>
                        <input
                            id="raw-footage"
                            type="url"
                            v-model="rawFootage"
                            placeholder="https://"
                            :required="!onPlatform"
                        />
                        <p class="type-label-md submit-record-hint">
                            Required if you're not on AREDL or Pointercrate.
                        </p>
                    </template>

                    <p v-if="error" class="submit-record-error type-label-md">{{ error }}</p>
                    <p v-if="success" class="submit-record-success type-label-md">{{ success }}</p>

                    <Btn type="submit" :disabled="submitting">
                        {{ submitting ? 'Sending...' : 'Submit a record' }}
                    </Btn>
                </form>
            </div>
        </main>
    `,
    data: () => ({
        playerName: '',
        levelName: '',
        videoLink: '',
        rawFootage: '',
        onPlatform: false,
        submitting: false,
        error: '',
        success: '',
    }),
    methods: {
        async onSubmit() {
            this.error = '';
            this.success = '';
            this.submitting = true;

            try {
                const response = await fetch(
                    `https://formsubmit.co/ajax/${SUBMIT_EMAIL}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                        body: JSON.stringify({
                            _subject: `Record Submission: ${this.levelName} - ${this.playerName}`,
                            _template: 'table',
                            player: this.playerName,
                            level: this.levelName,
                            video_link: this.videoLink,
                            on_aredl_or_pointercrate: this.onPlatform ? 'Yes' : 'No',
                            raw_footage: this.onPlatform
                                ? 'Not required (on AREDL/Pointercrate)'
                                : this.rawFootage,
                        }),
                    },
                );

                const result = await response.json();

                if (!response.ok || result.success !== 'true') {
                    throw new Error('Submission failed');
                }

                this.success =
                    'Your record was submitted successfully. We will review it soon.';
                this.playerName = '';
                this.levelName = '';
                this.videoLink = '';
                this.rawFootage = '';
                this.onPlatform = false;
            } catch {
                this.error =
                    'Could not send your submission. Please try again or contact us directly.';
            } finally {
                this.submitting = false;
            }
        },
    },
};
