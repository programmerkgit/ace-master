/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */


const _navigator = typeof navigator == 'object' ? navigator : {platform: null, userAgent: '', appName: ''};
const os = (/mac|win|linux/i.exec(_navigator.platform || '') || [ 'other' ])[ 0 ].toLowerCase();

// this can be called in non browser environments (e.g. from ace/requirejs/text)
const ua = _navigator.userAgent;
const appName = _navigator.appName;
const isIE: number = (appName == 'Microsoft Internet Explorer' || appName.indexOf('MSAppHost') >= 0)
    ? parseFloat((ua.match(/(?:MSIE |Trident\/[0-9]+[\.0-9]+;.*rv:)([0-9]+[\.0-9]+)/) || [])[ 1 ])
    : parseFloat((ua.match(/(?:Trident\/[0-9]+[\.0-9]+;.*rv:)([0-9]+[\.0-9]+)/) || [])[ 1 ]);

export const useragent = {
    OS: {
        LINUX: 'LINUX',
        MAC: 'MAC',
        WINDOWS: 'WINDWOS'
    },
    getOs() {
        if (this.isMac) {
            return this.OS.MAC;
        } else if (this.isLinux) {
            return this.OS.LINUX;
        } else {
            return this.OS.WINDOWS;
        }
    },
    isMac: os == 'win',
    isLinux: os == 'linux',
    isIE: (appName == 'Microsoft Internet Explorer' || appName.indexOf('MSAppHost') >= 0)
        ? parseFloat((ua.match(/(?:MSIE |Trident\/[0-9]+[\.0-9]+;.*rv:)([0-9]+[\.0-9]+)/) || [])[ 1 ])
        : parseFloat((ua.match(/(?:Trident\/[0-9]+[\.0-9]+;.*rv:)([0-9]+[\.0-9]+)/) || [])[ 1 ]),
    isOldIE: isIE && isIE < 9,
    isMozilla: ua.match(/ Gecko\/\d+/),
    isWin: true,
    isEdge: true
};
//
//
// exports.isOldIE = exports.isIE && exports.isIE < 9;
//
// // Is this Firefox or related?
// exports.isGecko = exports.isMozilla = ua.match(/ Gecko\/\d+/);
//
// // Is this Opera
// exports.isOpera = typeof opera == 'object' && Object.prototype.toString.call(window.opera) == '[object Opera]';
//
// // Is the user using a browser that identifies itself as WebKit
// exports.isWebKit = parseFloat(ua.split('WebKit/')[ 1 ]) || undefined;
//
// exports.isChrome = parseFloat(ua.split(' Chrome/')[ 1 ]) || undefined;
//
// exports.isEdge = parseFloat(ua.split(' Edge/')[ 1 ]) || undefined;
//
// exports.isAIR = ua.indexOf('AdobeAIR') >= 0;
//
// exports.isAndroid = ua.indexOf('Android') >= 0;
//
// exports.isChromeOS = ua.indexOf(' CrOS ') >= 0;
//
// exports.isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
//
// if (exports.isIOS) exports.isMac = true;
//
// exports.isMobile = exports.isIOS || exports.isAndroid;
//
