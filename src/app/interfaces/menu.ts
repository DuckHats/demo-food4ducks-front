export interface MenuOption {
    name: string;
    selected: boolean;
  }
  
  export interface MenuSection {
    title: string;
    options: MenuOption[];
  }