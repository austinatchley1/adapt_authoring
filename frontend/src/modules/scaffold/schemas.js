define([ 'core/origin', './models/schemasModel' ], function(Origin, SchemasModel) {

  var Schemas = function(schemaName) {
    var schema = JSON.parse(JSON.stringify(Origin.schemas.get(schemaName)));

    if (!schema) {
      throw new Error('No schema found for "' + schemaName + '"');
    }

    var config = Origin.editor.data.config;

    if (!config) {
      delete schema._extensions;
      return schema;
    }

    var enabledExtensions = _.pluck(config.get('_enabledExtensions'), 'targetAttribute');

    trimEmptyProperties(schema._extensions, enabledExtensions);
    trimEmptyProperties(schema.menuSettings, [config.get('_menu')]);
    trimEmptyProperties(schema.themeSettings, [config.get('_theme')]);

    if (schemaName === 'course') {
      var globals = schema._globals.properties;
      var enabledComponents = _.pluck(config.get('_enabledComponents'), '_component');
      // remove unrequired globals from the course
      trimEmptyProperties(globals._extensions, enabledExtensions);
      trimEmptyProperties(globals._components, enabledComponents);
      trimEmptyProperties(globals, enabledComponents);
      // trim off the empty globals objects
      trimEmptyProperties(globals);
    }
    // trim off any empty fieldsets
    trimEmptyProperties(schema);

    return schema;
  };

  function trimEmptyProperties(schemaData, enabledPlugins) {
    var properties = schemaData && schemaData.properties;
    for (var key in properties) {
      if (!properties.hasOwnProperty(key)) continue;
      if (!_.contains(enabledPlugins, key)) delete properties[key];
    }
  }

  function trimEmptyProperties(object) {
    for (key in object) {
      if (!object.hasOwnProperty(key)) continue;
      var properties = object[key].properties;
      if (properties && _.isEmpty(properties)) delete object[key];
    }
  }

  return Schemas;
});
