import { number, parse, pipe, safeParse, string, transform } from "valibot";
import { DraftProductSquema, Product, ProductSchema, ProductsSchema } from "../types";
import axios from 'axios';
import { toBoolean } from "../utils";

type ProductData = {
    [K: string]: FormDataEntryValue;
}

export async function addProduct(data: ProductData) {
    try {
        const result = safeParse(DraftProductSquema, { name: data.name, price: +data.price });
        if (result.success) {
            const url = `${import.meta.env.VITE_API_URL}/products`
            await axios.post(url, {
                name: result.output.name,
                price: result.output.price
            })

        } else {
            throw new Error('Datos no válidos')
        }
    } catch (err) {
        console.log(err)
    }
}

export async function getProducts() {

    try {
        const url = `${import.meta.env.VITE_API_URL}/products`
        const { data } = await axios.get(url)
        const result = safeParse(ProductsSchema, data.data)
        if (result.success) {
            return result.output
        } else {
            throw new Error('Hubo un error')
        }
    } catch (err) {
        console.log(err)
    }
}

export async function getProductById(id: Product['id']) {

    try {
        const url = `${import.meta.env.VITE_API_URL}/products/${id}`
        const { data } = await axios.get(url)
        const result = safeParse(ProductSchema, data.data)
        if (result.success) {
            return result.output
        } else {
            throw new Error('Hubo un error')
        }
    } catch (err) {
        console.log(err)
    }
}


export async function updateProduct(data: ProductData, id: Product['id']) {
    try {
        const NumberSchema = pipe(string(), transform(Number), number());
        const result = safeParse(ProductSchema, { id, name: data.name, price: parse(NumberSchema, data.price), availability: toBoolean(data.availability.toString()) });
        if (result.success) {
            const url = `${import.meta.env.VITE_API_URL}/products/${id}`
            await axios.put(url, result.output)

        } else {
            throw new Error('Datos no válidos')
        }
    } catch (err) {
        console.log(err)
    }
}
export async function deleteProduct(id: Product['id']) {
    
    try {
        const url = `${import.meta.env.VITE_API_URL}/products/${id}`
        await axios.delete(url)
    } catch (err) {
        console.log(err)
    }
}

export async function updateProductAvailability(id: Product['id']) {
    
    try {
        const url = `${import.meta.env.VITE_API_URL}/products/${id}`
        await axios.patch(url)
    } catch (err) {
        console.log(err)
    }
}