using System.Collections;
using NUnit.Framework;
using TemplatePackage;
using UnityEngine.TestTools;

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

    [UnityTest]
    public IEnumerator AddAsync()
    {
      yield return null;
      Assert.AreEqual(4, multiplyValueInst.Multiply(2));
    }

    [TearDown]
    public void Destroy()
    {
      multiplyValueInst = null;
    }
  }
}
