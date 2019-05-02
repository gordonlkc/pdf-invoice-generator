import jsonOverride from 'json-override';
import Generator from './generator';

let configuration;

export default {

  /**
   * @description Configure invoiceIt with object config
   * @param config
   */
  configure: (config) => configuration = jsonOverride(configuration, config),

  /**
   * @description Generate invoiceIt with configuration
   * @returns {Generator}
   */
  create: () => {
    const generator = new Generator(configuration);
    return generator;
  },

};
