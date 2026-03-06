using System.ComponentModel.DataAnnotations;

namespace Core.DTO.Citizens
{
    public class CreateCitizenDto
    {
        [Required(ErrorMessage = "IdentityNumber is required")]
        [StringLength(20, ErrorMessage = "IdentityNumber cannot be longer than 20 characters")]
        public string IdentityNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "FullName is required")]
        [StringLength(200, ErrorMessage = "FullName cannot be longer than 200 characters")]
        public string FullName { get; set; } = string.Empty;
    }
}

