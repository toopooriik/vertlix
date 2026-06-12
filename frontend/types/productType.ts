export default interface ProductType {
    id: number;
    categoryId: number;
    category: string;
    name: string;
    source: string;
    site: string;
    price: number;
    link: string;
    image: string;
    description: string;
    characteristics: Record<string, string>;
}