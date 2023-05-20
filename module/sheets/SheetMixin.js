import { Stat } from "../ACStat.js"

//
//  A mixin containing shared methods between ACActorSheet and ACItemSheet schema.
//
export const ACSheetMixin = {

    //  Shrinks the font size of a div as more content is added.
    //      _div    (html)      : The desired HTML element for adjusting font
    //      _rem    (number)    : The default size of the font in rem units
    //      _max    (integer)   : The max amount of vertical space the div can take up in pixels
    adjustFontSize(_div, _rem, _max) {
        const text = $(_div);

        text.css( 'fontSize', `${_rem}rem`);

        while (text.height() > _max) {
            _rem *= 0.85;
            text.css( 'fontSize', `${_rem}rem`);
            console.log('Anime Campaign | Resizing Text');
        } 
    },

    //  Updates the entity's name and resizes it on the entity sheet.
    //      _html   (jQuery)    : The entity sheet form as a jQuery object
    //      _rem    (number)    : The default size of the font in rem units
    //      _max    (integer)   : The max amount of vertical space the div can take up in pixels
    updateName(_html, _rem, _max) {
        const NAME = _html.find('.name');
        const nameResize = new ResizeObserver(e => {
            this.adjustFontSize(NAME, _rem, _max)
        })
        nameResize.observe(NAME[0]);
        nameResize.observe(_html[0]);

        _html.ready(() => this.adjustFontSize(NAME, _rem, _max));

        NAME.on('blur', e => this.object.update({ 'name': NAME.text() }));
        NAME[0].addEventListener('paste', e => e.preventDefault())
    },

    updateStat(_html) {
        const STAT_CONTENT = _html.find('.stat-content');
        const regex = new RegExp(/[A-Z]|[a-z]/, 'g');

        STAT_CONTENT.children().on('keydown', e => {
            const stat = e.currentTarget;

            if (regex.test(stat.value)) {
                $(stat)
                    .css('transform', 'scaleX(0.8)')
                    .css('font-weight', 'normal')
                ;
            }

            //TODO MAKE IT STAY AS IT IS
        })
    },

    //  Creates a blank stat.
    //      _html   (jQuery)    : The entity sheet form as a jQuery object
    createBlankStat(_html) {
        let stats = this.object.system.stats;

        _html.find('.stat-create').on('click', event => {
            let blankStat = new Stat()

            this.object.update({ 'system.stats': [...stats, blankStat] })
        })
    },

    //  Updates the background color of the header of entity sheets.
    //      _html       (jQuery)    : The entity sheet form as a jQuery object
    //      _threshold  (number)    : A number between 0 and 1, when the foreground text should change
    //                                  based on percieved lightness value of the background color
    updateBackground(_html, _threshold) {
        const BACKGROUND = _html.find('.background');
        const BACKGROUND_INPUT = _html.find('.background-input');
        const NAME = _html.find('.name');
        const CLASS = _html.find('.class');
        const IMG = _html.find('.img');

        const inputColor = BACKGROUND_INPUT[0].defaultValue

        let rgb = [inputColor.slice(1, 3), inputColor.slice(3, 5), inputColor.slice(5)]
            .map(element => Number(`0x${element}`));
        rgb[0] *= 0.2126;
        rgb[1] *= 0.7152;
        rgb[2] *= 0.0722;

        const perceivedLightness = rgb.reduce((n, m) => n + m) / 255;

        if (perceivedLightness <= _threshold) {
            NAME.css( 'color', "#FFFFFF" );
            CLASS.css( 'color', "#FFFFFF" );
        } else {
            NAME.css( 'color', "#000000" );
            CLASS.css( 'color', "#000000" );
        }

        BACKGROUND.css( "background-color", BACKGROUND_INPUT[0].defaultValue );
        IMG.css( 'background-color', BACKGROUND_INPUT[0].defaultValue );
    },

    updateStatBlocks() {
        //TODO Add in Background functionality for Stats.
    }
}