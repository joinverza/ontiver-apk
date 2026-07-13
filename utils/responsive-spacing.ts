export const FLOATING_TAB_BAR_HEIGHT = 82;
export const FLOATING_TAB_BAR_RADIUS = 30;
export const FLOATING_TAB_BAR_MIN_BOTTOM = 12;
export const FLOATING_TAB_CENTER_OVERHANG = 34;

export function getFloatingTabBarBottomOffset(bottomInset: number) {
  return Math.max(bottomInset, FLOATING_TAB_BAR_MIN_BOTTOM);
}

export function getFloatingTabBarContentPadding(bottomInset: number, extra = 40) {
  return (
    FLOATING_TAB_BAR_HEIGHT +
    getFloatingTabBarBottomOffset(bottomInset) +
    FLOATING_TAB_CENTER_OVERHANG +
    extra
  );
}

export function getFloatingActionButtonBottom(bottomInset: number, extra = 16) {
  return FLOATING_TAB_BAR_HEIGHT + getFloatingTabBarBottomOffset(bottomInset) + extra;
}
