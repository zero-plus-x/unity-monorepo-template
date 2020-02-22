using NUnit.Framework;
using TemplatePackage;

namespace EditorTests
{
  public class Tests_MultiplyValues
  {
    private MultiplyValues multiplyValueInst;

    [SetUp]
    public void Setup()
    {
      multiplyValueInst = new MultiplyValues(2);
    }

    [Test]
    public void Multiply_2_2()
    {
      Assert.AreEqual(4, multiplyValueInst.Multiply(2));
    }

    [TearDown]
    public void Destroy()
    {
      multiplyValueInst = null;
    }
  }
}
