/**
 * This is an entry point for additional assets, require your assets under this file.
 * Example:
 *   require('./bootstrap/css/bootstrap.min.css');
 * If you try using bootstrap 4, see: https://github.com/shakacode/bootstrap-loader/issues/244
 */

import * as $ from 'jquery';
window.jQuery = window.$ = $;

require('./js/avt.js');
require('./js/custom.js');
// require('./js/phone_mask.js');
