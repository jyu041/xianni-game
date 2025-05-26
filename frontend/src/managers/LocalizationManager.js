import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '../data/localization/index.js';

class LocalizationManager {
  constructor() {
    this.currentLocale = DEFAULT_LOCALE;
    this.translations = SUPPORTED_LOCALES[DEFAULT_LOCALE];
    this.fallbackTranslations = SUPPORTED_LOCALES['en-US'];
  }

  // Set current language
  setLanguage(locale) {
    if (!SUPPORTED_LOCALES[locale]) {
      console.warn(`Locale ${locale} not supported, falling back to ${DEFAULT_LOCALE}`);
      locale = DEFAULT_LOCALE;
    }
    
    this.currentLocale = locale;
    this.translations = SUPPORTED_LOCALES[locale];
    
    console.log(`Language set to: ${locale}`);
    
    // Update game store
    import('./StateManager.js').then(({ default: useGameStore }) => {
      useGameStore.getState().updateSettings({ language: locale });
    });
  }

  // Get translation by key path
  t(keyPath, params = {}) {
    const keys = keyPath.split('.');
    let value = this.translations;
    
    // Navigate through the translation object
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        // Try fallback
        value = this.fallbackTranslations;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            console.warn(`Translation key not found: ${keyPath}`);
            return keyPath; // Return key path if translation not found
          }
        }
        break;
      }
    }
    
    if (typeof value !== 'string') {
      console.warn(`Translation key ${keyPath} does not resolve to a string`);
      return keyPath;
    }
    
    // Replace parameters
    return this.interpolate(value, params);
  }

  // Interpolate parameters into translation string
  interpolate(text, params) {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  }

  // Get current locale
  getCurrentLocale() {
    return this.currentLocale;
  }

  // Get available locales
  getAvailableLocales() {
    return Object.keys(SUPPORTED_LOCALES);
  }

  // Get locale display name
  getLocaleDisplayName(locale) {
    const displayNames = {
      'zh-CN': '中文',
      'en-US': 'English'
    };
    return displayNames[locale] || locale;
  }

  // Format numbers according to locale
  formatNumber(number, options = {}) {
    try {
      return new Intl.NumberFormat(this.currentLocale, options).format(number);
    } catch (error) {
      console.warn('Number formatting failed:', error);
      return number.toString();
    }
  }

  // Format dates according to locale
  formatDate(date, options = {}) {
    try {
      return new Intl.DateTimeFormat(this.currentLocale, options).format(date);
    } catch (error) {
      console.warn('Date formatting failed:', error);
      return date.toString();
    }
  }

  // Format currency (for in-game currency)
  formatCurrency(amount, currency = '灵石') {
    const formattedAmount = this.formatNumber(amount);
    return `${formattedAmount} ${currency}`;
  }

  // Get cultivation realm name in current language
  getCultivationRealmName(realmId) {
    return this.t(`cultivation.realms.${realmId}`, { fallback: realmId });
  }

  // Get item name in current language
  getItemName(itemId) {
    return this.t(`items.${itemId}.name`, { fallback: itemId });
  }

  // Get item description in current language
  getItemDescription(itemId) {
    return this.t(`items.${itemId}.description`, { fallback: '' });
  }

  // Pluralization helper
  plural(count, singularKey, pluralKey = null) {
    if (count === 1) {
      return this.t(singularKey);
    } else {
      return this.t(pluralKey || singularKey + '_plural');
    }
  }

  // React hook for easy integration
  useTranslation() {
    return {
      t: (key, params) => this.t(key, params),
      locale: this.currentLocale,
      setLanguage: (locale) => this.setLanguage(locale)
    };
  }
}

export default new LocalizationManager();
