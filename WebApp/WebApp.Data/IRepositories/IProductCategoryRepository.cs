using System;
using System.Collections.Generic;
using System.Text;
using WebApp.Data.Entities;
using WebApp.Infrastructure.Interfaces;

namespace WebApp.Data.IRepositories
{
    public interface IProductCategoryRepository : IRepository<ProductCategory, int>
    {
        List<ProductCategory> GetByAlias(string alias);
    }
}
