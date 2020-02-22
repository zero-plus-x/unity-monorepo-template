namespace TemplatePackage
{
  public class MultiplyValues
  {
    private int baseValue = 1;

    public MultiplyValues(int bv)
    {
      baseValue = bv;
    }

    public int Multiply(int value)
    {
      return baseValue * value;
    }
  }
}
