using WebApi.Models;

using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;


namespace WebApi.Services
{
    public class ProductoReport
    {
        public static byte[] Generate(List<Productos> productos)
        {
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(20);
                    page.Header().Text("Reporte de Productos").FontSize(20).Bold().AlignCenter();
                    page.Content().Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn(2); // Nombre
                            columns.RelativeColumn(3); // Descripción
                            columns.RelativeColumn(1); // Precio
                            columns.RelativeColumn(1); // Estado
                        });

                        table.Header(header =>
                        {
                            header.Cell().Text("Nombre").Bold();
                            header.Cell().Text("Descripción").Bold();
                            header.Cell().Text("Precio").Bold();
                            header.Cell().Text("Estado").Bold();
                        });

                        foreach (var p in productos)
                        {
                            table.Cell().Text(p.Nombre);
                            table.Cell().Text(p.Descripcion ?? "");
                            table.Cell().Text(p.Precio.ToString("C"));
                            table.Cell().Text(p.Estado ? "Activo" : "Inactivo");
                        }
                    });
                    page.Footer().AlignCenter().Text(x =>
                    {
                        x.CurrentPageNumber();
                        x.Span(" / ");
                        x.TotalPages();
                    });
                });
            });

            return document.GeneratePdf();
        }


    }
}
