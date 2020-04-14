export class BookMark {
    id: number;
    book_id: number;
    cfi: string;
}

export class BookNote {
    id: number;
    cfi_range: string;
    text_selected: string;
    book_id: number;
    note: string;
}

export class HighLight {
    id: number;
    cfi_range: string;
    text_selected: string;
    book_id: number;
    style: string;
}