/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-08-14
 * @author Liang <liang@maichong.it>
 */

'use strict';

const alaska = require('alaska');
const mongoose = require('mongoose');

class FilterField extends alaska.Field {
  init() {
    let ref = this.ref || alaska.error(`${this._model.path}.fields.${this.path}.ref not found`);
    if (ref.isModel) {
      ref = ref.path;
    } else if (ref[0] !== ':' && ref.indexOf('.') === -1) {
      ref = this._model.service.id + '.' + ref;
    }
    this.ref = ref;

    let service = this._model.service;

    let field = this;
    this.underscoreMethod('filter', function () {
      let data = this.get(field.path);
      if (!data) return null;
      let modelPath = ref;
      if (ref[0] === ':') {
        modelPath = this.get(ref.substr(1));
        if (!modelPath) return null;
      }
      if (!modelPath) {
        return null;
      }
      let Model = service.model(modelPath, true);
      if (!Model) return null;
      let res = Model.createFilters('', data);
      return res;
    });
  }
}

FilterField.views = {
  view: {
    name: 'FilterFieldView',
    path: __dirname + '/lib/view.js'
  }
};

FilterField.plain = mongoose.Schema.Types.Mixed;

FilterField.viewOptions = ['ref'];

module.exports = FilterField;
