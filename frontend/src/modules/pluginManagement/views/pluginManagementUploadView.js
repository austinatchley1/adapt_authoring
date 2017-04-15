// LICENCE https://github.com/adaptlearning/adapt_authoring/blob/master/LICENSE
define(function(require){
  var _ = require('underscore');
  var Backbone = require('backbone');
  var Helpers = require('core/helpers');
  var OriginView = require('core/views/originView');
  var Origin = require('core/origin');
  var AssetModel = require('modules/assetManagement/models/assetModel');
  var TagsInput = require('libraries/jquery.tagsinput.min');

  var PluginManagementUploadView = OriginView.extend({

    className: 'pluginManagement-upload-plugin',

    events: {
    },

    preRender: function() {
      Origin.trigger('location:title:update', {title: Origin.l10n.t('app.uploadplugin')});
      this.listenTo(Origin, 'pluginManagement:uploadPlugin', this.uploadFile);
    },

    postRender: function() {
      _.defer(this.setViewToReady);
    },

    uploadFile: function() {
      var self = this;

      if(this.validate()) {
        $('.loading').show();
        this.$('.plugin-form').ajaxSubmit({
          error: function(data, status, error) {
            $('.loading').hide();

            var message = '';
            if (data) {
              if (data.responseText) {
                message = data.responseText;
              } else if(data.responseJSON && data.responseJSON.error) {
                message = data.responseJSON.error;
              }
            }
            Origin.Notify.alert({
              type: 'error',
              title: Origin.l10n.t('app.uploadpluginerror'),
              text: Helpers.decodeHTML(message)
            });

            // go back to the upload, maybe handle this in the sidebar?
            Origin.router.navigateTo('pluginManagement/upload');
          },
          success: function(data, status, xhr) {
            Origin.trigger('scaffold:updateSchemas', function() {
              Origin.Notify.alert({
                type: 'success',
                text: Origin.l10n.t('app.uploadpluginsuccess')
              });

              $('.loading').hide();
              var pluginType = data.pluginType ? data.pluginType : '';
              Origin.router.navigateTo('pluginManagement/' + pluginType);
            }, this);
          }
        });
      }

      // Return false to prevent the page submitting
      return false;
    },

    validate: function() {
      var file = this.$('form input').val();

      if(_.isEmpty(file)) {
        this.$('.field-error').removeClass('display-none');
        Origin.trigger('sidebar:resetButtons');

        return false;
      }

      this.$('.field-error').addClass('display-none');

      return true;
    }

  }, {
    template: 'pluginManagementUpload'
  });

  return PluginManagementUploadView;

});
