namespace TemplatePackage
{
  public class AddValues
  {
    private int baseValue = 0;

    public AddValues(int bv)
    {
      baseValue = bv;
    }

    public int Add(int value)
    {
      return baseValue + value;
    }
  }
}
