namespace ArtStoreAPI.ModelsDTO;

public class MakerDTO
{
    public int? MakerId { get; set; }
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public long? CreatedAt { get; set; }
}
