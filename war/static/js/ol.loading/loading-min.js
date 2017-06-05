/*
* ol.loading plugin
* Version 1.1 (12/7/2010)
* @requires jQuery v1.2.6 or later
*
* Example at: http://www.open-lib.com/Lib/1066.jsp
*
* Copyright (c) 2009-2010 Open-Lib.Com
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
* Read the related post and contact the author at http://www.open-lib.com/Lib/1066.jsp
*
* This version is far from perfect and doesn't manage it's own state, therefore contributions are more than welcome!
*
* Usage: var loading=new ol.loading({id:"table1"});
*		loading.show();
*		loading.hide();
*
* Tested in IE6 IE7 Firefox. Any browser strangeness, please report.
*/
if (!window['ol']) {
	window['ol'] = {};
}
(function() {
	var $ = jQuery;
	ol.loading=function(options) {
		var self=this;
		this.loadingImg;
		this.loadingMask;
		this.container;

		var _defaults= {
			id:null,
			loadingClass:null,
			zIndex:800
		};


		this.init=function(){
			options  = $.extend({},_defaults, options);
			this.container=$("#"+options.id);

			this.loadingMask=$('<div class="ol_loading_mask"></div>');
			this.loadingMask.css({
				zIndex: options.zIndex
			});
			this.loadingImg=$('<div class="ol_loading"></div>').css("z-index",options.zIndex+1);
			if(!options.loadingClass)
			{
				this.loadingImg.addClass(options.loadingClass);
				this.loadingMask.addClass(options.loadingClass+"_mask");
			}

			this.container.parent().append(this.loadingMask).append(this.loadingImg);
			this.loadingMask.bgiframe();
		}

		this.show=function()
		{
			if ($.browser.msie && /6.0/.test(navigator.userAgent)) {
				this.loadingMask.css({
					width:this.container.outerWidth(),
					height:this.container.outerHeight()
				});
			}
			this.loadingMask.css("display", "block");
			this.loadingImg.css("display", "block");
		}
		this.hide=function()
		{
			this.loadingMask.css("display", "none");
			this.loadingImg.fadeOut(0);
		}
		this.remove=function()
		{
			this.loadingMask.remove();
			this.loadingImg.remove();
		}
		this.init();
	};
})();
