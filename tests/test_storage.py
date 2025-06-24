import unittest
import tempfile
from pathlib import Path
import storage

class StorageTest(unittest.TestCase):
    def setUp(self):
        self.tmpdir = tempfile.TemporaryDirectory()
        self.old_file = storage.DATA_FILE
        storage.DATA_FILE = Path(self.tmpdir.name) / "data.json"

    def tearDown(self):
        storage.DATA_FILE = self.old_file
        self.tmpdir.cleanup()

    def test_add_and_load(self):
        entry = storage.add_entry(3, "Teste", timestamp="2025-06-24T00:00")
        data = storage.load_data()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["id"], entry["id"])

    def test_remove(self):
        entry = storage.add_entry(2, "Apagar")
        removed = storage.remove_entry(entry["id"])
        self.assertTrue(removed)
        self.assertEqual(storage.load_data(), [])

    def test_stats(self):
        storage.add_entry(1, "A")
        storage.add_entry(3, "B")
        stats = storage.compute_stats()
        self.assertEqual(stats["total"], 2)
        self.assertEqual(stats["nivel_maximo"], 3)
        self.assertEqual(stats["media_nivel"], 2.0)

if __name__ == "__main__":
    unittest.main()
