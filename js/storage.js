/* =========================================================================
 * Leftover Chef — STORAGE (browser only, consent first)
 *   lc-consent : your cookie-banner choice (essential, always kept)
 *   lc-state   : picks, shopping list, mode, filters (ONLY if you opt in)
 * Nothing is ever sent to a server. Every call is wrapped in try/catch
 * because some browsers block storage.
 * ========================================================================= */
var LC = (window.LC = window.LC || {});

LC.Store = (function () {
  var KEYS = { consent: "lc-consent", state: "lc-state" };
  function get(k) { try { var v = window.localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
  function set(k, v) { try { window.localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  function remove(k) { try { window.localStorage.removeItem(k); } catch (e) { /* storage blocked */ } }

  return {
    KEYS: KEYS,
    consent: function () { return get(KEYS.consent); },
    setConsent: function (remember) {
      set(KEYS.consent, { essential: true, remember: !!remember, date: new Date().toISOString().slice(0, 10) });
      if (!remember) remove(KEYS.state);
    },
    canRemember: function () { var c = get(KEYS.consent); return !!(c && c.remember); },
    saveState: function (s) {
      if (!this.canRemember()) return;
      set(KEYS.state, { selected: s.selected, shopping: s.shopping, mode: s.mode, filters: s.filters });
    },
    loadState: function () { return this.canRemember() ? get(KEYS.state) : null; },
    resetAll: function () { remove(KEYS.state); remove(KEYS.consent); },
  };
})();
