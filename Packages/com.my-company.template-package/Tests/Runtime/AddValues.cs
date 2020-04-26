using NUnit.Framework;
using TemplatePackage;
using UnityEngine;
using UnityEngine.TestTools;
using System.Collections;

namespace RuntimeTests
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

    [UnityTest]
    public IEnumerator AddAsync()
    {
      yield return new WaitForSeconds(0.1f);
      Assert.AreEqual(5, addValueInst.Add(3));
    }


    [TearDown]
    public void Destroy()
    {
      addValueInst = null;
    }
  }
}
