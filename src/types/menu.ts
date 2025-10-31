export type SubmenuItem = {
  label: string;
  href: string;
};

export type HeaderItem = {
  label: string;
  href: string;
  isUrl?: boolean;
  submenu?: SubmenuItem[];
};