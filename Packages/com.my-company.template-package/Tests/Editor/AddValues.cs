using NUnit.Framework;
using TemplatePackage;

namespace EditorTests
{
  public class Tests_AddValues
  {
    private AddValues addValueInst;

    [SetUp]
    public void Setup()
    {
      addValueInst = new AddValues(2);
    }

    [Test]
    public void Add_2_2()
    {
      Assert.AreEqual(4, addValueInst.Add(2));
    }

    [TearDown]
    public void Destroy()
    {
      addValueInst = null;
    }
  }
}
