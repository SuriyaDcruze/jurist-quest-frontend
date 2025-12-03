import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileText,
  CheckCircle,
  Cloud,
  Loader2,
} from "lucide-react";
import useMemorials from "@/hooks/useMemorials";
import MemorialUploadSkeleton from "@/components/skeleton/TeamDashboard/MemorialUploadSkeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MemorialUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const {
    memorials,
    isLoading,
    error,
    uploadMemorial,
  } = useMemorials();
  const [isUploading, setIsUploading] = useState(false);
  const [mootProblem, setMootProblem] = useState("");
  const [language, setLanguage] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (file.type !== "application/pdf") {
        setUploadError("Only PDF files are allowed. Please select a PDF file.");
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        setUploadError("File size exceeds 10MB limit. Please select a smaller file.");
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }

      setUploadError(null);
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      // Validate file type
      if (file.type !== "application/pdf") {
        setUploadError("Only PDF files are allowed. Please drag and drop a PDF file.");
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        setUploadError("File size exceeds 10MB limit. Please select a smaller file.");
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }

      setUploadError(null);
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleUpload = async () => {
    if (selectedFile && mootProblem) {
      setIsUploading(true);
      setUploadError(null);
      try {
        // Default to English for Moot Problem 2
        const uploadLanguage = mootProblem.includes("problem2") ? "english" : language;
        if (!uploadLanguage) {
          throw new Error("Language selection is required for Moot Problem 1");
        }
        await uploadMemorial(selectedFile, `${mootProblem}_${uploadLanguage}`);
        setSelectedFile(null);
        setMootProblem("");
        setLanguage("");
        setPreviewUrl(null);
        const fileInput = document.getElementById("memorial-upload") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } catch (uploadError: any) {
        setUploadError(uploadError.message);
      } finally {
        setIsUploading(false);
      }
    }
  };

  if (isLoading) {
    return <MemorialUploadSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error.message}</p>
      </div>
    );
  }

  // Extract base problem names without language for disabling already uploaded options
  const getBaseProblemName = (problem: string) => {
    const parts = problem.split('_');
    return `${parts[0]}_${parts[1]}`; // Returns "problem1_petitioner" etc.
  };

  const submittedProblems = memorials.map(m => getBaseProblemName(m.moot_problem));
  const showLanguageSelect = mootProblem === "problem1_petitioner" || mootProblem === "problem1_respondent";

  // Function to format the display of the moot problem with language
  const formatProblemDisplay = (problem: string) => {
    const parts = problem.split('_');
    if (parts.length === 3) {
      const problemNumber = parts[0].replace('problem', '');
      const side = parts[1] === 'petitioner' ? 'Petitioner' : 'Respondent';
      const language = parts[2].charAt(0).toUpperCase() + parts[2].slice(1);
      return `Moot Memorial - ${problemNumber} (${side}) - ${language}`;
    }
    return problem;
  };

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-gray-900">Submit Memorial</CardTitle>
          <CardDescription>
            Upload your memorial document (PDF format only, max 10MB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select onValueChange={setMootProblem} value={mootProblem}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Moot Problem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="problem1_petitioner"
                  disabled={submittedProblems.includes("problem1_petitioner")}
                >
                  Moot Memorial - 1 (Petitioner)
                </SelectItem>
                <SelectItem
                  value="problem1_respondent"
                  disabled={submittedProblems.includes("problem1_respondent")}
                >
                  Moot Memorial - 1 (Respondent)
                </SelectItem>
                <SelectItem
                  value="problem2_petitioner"
                  disabled={submittedProblems.includes("problem2_petitioner")}
                >
                  Moot Memorial - 2 (Petitioner)
                </SelectItem>
                <SelectItem
                  value="problem2_respondent"
                  disabled={submittedProblems.includes("problem2_respondent")}
                >
                  Moot Memorial - 2 (Respondent)
                </SelectItem>
              </SelectContent>
            </Select>

            {showLanguageSelect && (
              <Select onValueChange={setLanguage} value={language}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Language for Moot Oration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="tamil">Tamil</SelectItem>
                  <SelectItem value="telugu">Telugu</SelectItem>
                  <SelectItem value="kannada">Kannada</SelectItem>
                  <SelectItem value="malayalam">Malayalam</SelectItem>
                </SelectContent>
              </Select>
            )}

            <div
              className="border-2 border-dashed border-[#2d4817] rounded-lg p-8 text-center hover:border-[#2a4015] transition-colors"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <Cloud className="h-12 w-12 text-[#2d4817] mx-auto" />
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Drag your file(s) or </span>
                <label
                  htmlFor="memorial-upload"
                  className="text-[#2d4817] hover:text-[#2a4015] cursor-pointer underline"
                >
                  browse
                </label>
              </p>
              <p className="text-sm text-gray-500 mb-4">Max 10 MB files are allowed</p>

              <input
                id="memorial-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />

              {selectedFile && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 justify-center">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">{selectedFile.name}</span>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">
                    Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {mootProblem && (
                    <p className="text-sm text-blue-600 mt-1">
                      Moot Problem:{" "}
                      {mootProblem === "problem1_petitioner"
                        ? "Moot Memorial - 1 (Petitioner)"
                        : mootProblem === "problem1_respondent"
                        ? "Moot Memorial - 1 (Respondent)"
                        : mootProblem === "problem2_petitioner"
                        ? "Moot Memorial - 2 (Petitioner)"
                        : "Moot Memorial - 2 (Respondent)"}
                    </p>
                  )}
                  {language && showLanguageSelect && (
                    <p className="text-sm text-blue-600 mt-1">
                      Language: {language.charAt(0).toUpperCase() + language.slice(1)}
                    </p>
                  )}
                  {previewUrl && (
                    <div className="mt-4">
                      <iframe
                        src={previewUrl}
                        className="w-full h-96 rounded-lg"
                        title="PDF Preview"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}

            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading || !mootProblem || (showLanguageSelect && !language)}
              className="w-full mt-4 bg-[#2d4817] hover:bg-[#2a4015] text-white"
            >
              {isUploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Upload
            </Button>

            <div className="mt-3 space-y-1 text-xs text-gray-500">
              <p>• Only PDF files are accepted</p>
              <p>• Maximum file size: 10MB</p>
              <p>• File naming: Memorial_TeamName_v[version].pdf</p>
              <p>• Moot Memorial 2 will use English as the default language for Moot Oration</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload History */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-gray-900">Upload History</CardTitle>
          <CardDescription>
            Track your memorial submissions and versions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {memorials.length > 0 ? (
              memorials.map((upload) => (
                <div
                  key={upload.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {upload.file.split("/").pop()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatProblemDisplay(upload.moot_problem)} -{" "}
                        {new Date(upload.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No uploads yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemorialUpload;
