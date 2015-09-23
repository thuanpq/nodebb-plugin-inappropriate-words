"use strict";

var meta = module.parent.require('./meta'),
    controllers = require('./lib/controllers'),
    plugin = {settings: {}};

plugin.preinit = function() {
    meta.settings.get('inappropriate-words', function(err, settings) {
        if (!err && settings.inappropriatewords && settings.inappropriatewords.length) {
            plugin.settings = settings;
        } else {
            winston.error('Inappropriate Words was not specified. Please complete setup in the administration panel.');
        }
    });
};

plugin.init = function (params, callback) {
    var router = params.router,
        hostMiddleware = params.middleware,
        hostControllers = params.controllers;

    // We create two routes for every view. One API call, and the actual route itself.
    // Just add the buildHeader middleware to your route and NodeBB will take care of everything for you.

    router.get('/admin/plugins/inappropriate-words', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
    router.get('/api/admin/plugins/inappropriate-words', controllers.renderAdminPage);

    callback();
};

plugin.addAdminNavigation = function (header, callback) {
    header.plugins.push({
        route: '/plugins/inappropriate-words',
        icon: 'fa-tint',
        name: 'Inappropriate Words'
    });

    callback(null, header);
};

var str2Replace = '******';

plugin.parse = function (data, callback) {

    if (!data || !data.postData || !data.postData.content) {
        return callback(null, data);
    }

    if (plugin.settings !== undefined) {
        var arr_words = plugin.settings.inappropriatewords.split('\n'),
            length = arr_words.length;
        while(length--) {
            if (data.postData.content.indexOf(arr_words[length]) != -1) {
                data.postData.content = data.postData.content.replace(arr_words[length], str2Replace);
            }
        }
    }

    callback(null, data);
};

module.exports = plugin;