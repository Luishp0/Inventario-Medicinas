import { PaginationParams } from "../types/pagination";

export function prepararPaginacion(params: PaginationParams) {
    const page = Math.max(Number(params.page) || 1, 1);

    const limit = Math.min(
        Math.max(Number(params.limit) || 10, 1),
        100
    );

    const skip = (page - 1) * limit;

    const order: "asc" | "desc" =
        params.order === "desc" ? "desc" : "asc";

    return {
        page,
        limit,
        skip,
        order
    };
}

export function calcularTotalPaginas(
    total: number,
    limit: number
) {
    return Math.ceil(total / limit);
}
