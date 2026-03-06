using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IRepository<T, E> where T : class
    {
        Task<T> AddAsync(T entity);
        Task DeleteAsync(E id);
        Task<T?> GetByIdAsync(E id);
        Task<List<T>> GetAllAsync();
        Task UpdateAsync(T entity);
    }
}

