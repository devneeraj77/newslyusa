"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  Info,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { IconSeo } from "@tabler/icons-react";

const STOP_WORDS = new Set([
  "a",
  "about",
  "above",
  "after",
  "again",
  "against",
  "all",
  "am",
  "an",
  "and",
  "any",
  "are",
  "as",
  "at",
  "be",
  "because",
  "been",
  "before",
  "being",
  "below",
  "between",
  "both",
  "but",
  "by",
  "can",
  "could",
  "did",
  "do",
  "does",
  "doing",
  "don",
  "down",
  "during",
  "each",
  "few",
  "for",
  "from",
  "further",
  "had",
  "has",
  "have",
  "having",
  "he",
  "her",
  "here",
  "hers",
  "herself",
  "him",
  "himself",
  "his",
  "how",
  "i",
  "if",
  "in",
  "into",
  "is",
  "it",
  "its",
  "itself",
  "just",
  "ll",
  "me",
  "more",
  "most",
  "my",
  "myself",
  "no",
  "nor",
  "not",
  "now",
  "of",
  "off",
  "on",
  "once",
  "only",
  "or",
  "other",
  "our",
  "ours",
  "ourselves",
  "out",
  "over",
  "own",
  "s",
  "same",
  "she",
  "should",
  "so",
  "some",
  "such",
  "t",
  "than",
  "that",
  "the",
  "their",
  "theirs",
  "them",
  "themselves",
  "then",
  "there",
  "these",
  "they",
  "this",
  "those",
  "through",
  "to",
  "too",
  "under",
  "until",
  "up",
  "very",
  "was",
  "we",
  "were",
  "what",
  "when",
  "where",
  "which",
  "while",
  "who",
  "whom",
  "why",
  "will",
  "with",
  "won",
  "you",
  "your",
  "yours",
  "yourself",
  "yourselves",
]);

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\\]/g, "\\$&\\");
}

interface SeoStatusCardProps {
  data: {
    title: string;
    slug: string;
    description: string;
    content: string;
    image: string;
    tagIds: string[];
    categoryIds: string[];
  };
}

interface SeoCheck {
  label: string;
  status: "success" | "warning" | "error";
  message: string;
}

interface DetectedKeyword {
  word: string;
  count: number;
  density: number;
}

export function SeoStatusCard({ data }: SeoStatusCardProps) {
  const [score, setScore] = useState(0);
  const [generalChecks, setGeneralChecks] = useState<SeoCheck[]>([]);
  const [keywordChecks, setKeywordChecks] = useState<SeoCheck[]>([]);
  const [focusKeyword, setFocusKeyword] = useState("");
  const [detectedKeywords, setDetectedKeywords] = useState<DetectedKeyword[]>(
    [],
  );

  useEffect(() => {
    calculateSeoScore();
  }, [data, focusKeyword]);

  const calculateSeoScore = () => {
    let newScore = 0;
    const newGeneralChecks: SeoCheck[] = [];
    const newKeywordChecks: SeoCheck[] = [];

    // --- General SEO Checks ---

    // 1. Title Check
    if (data.title.length >= 40 && data.title.length <= 60) {
      newScore += 15;
      newGeneralChecks.push({
        label: "Title Length",
        status: "success",
        message: "Perfect length (40-60 chars)",
      });
    } else if (data.title.length > 0) {
      newScore += 5;
      newGeneralChecks.push({
        label: "Title Length",
        status: "warning",
        message: "Should be between 40-60 chars",
      });
    } else {
      newGeneralChecks.push({
        label: "Title",
        status: "error",
        message: "Title is missing",
      });
    }

    // 2. Slug Check
    if (data.slug.length > 0 && !data.slug.includes(" ")) {
      newScore += 10;
      newGeneralChecks.push({
        label: "Slug",
        status: "success",
        message: "Valid slug format",
      });
    } else {
      newGeneralChecks.push({
        label: "Slug",
        status: "error",
        message: "Slug is missing or invalid",
      });
    }

    // 3. Description Check
    if (data.description.length >= 120 && data.description.length <= 160) {
      newScore += 15;
      newGeneralChecks.push({
        label: "Description",
        status: "success",
        message: "Perfect length (120-160 chars)",
      });
    } else if (data.description.length > 0) {
      newScore += 5;
      newGeneralChecks.push({
        label: "Description",
        status: "warning",
        message: "Should be between 120-160 chars",
      });
    } else {
      newGeneralChecks.push({
        label: "Description",
        status: "error",
        message: "Meta description is missing",
      });
    }

    // 4. Content Length
    const plainTextContent = data.content.replace(/<[^>]*>/g, "");
    const words = plainTextContent.split(/\s+/).filter((w) => w.length > 0);
    const wordCount = words.length;

    if (wordCount >= 300) {
      newScore += 15;
      newGeneralChecks.push({
        label: "Content Length",
        status: "success",
        message: `Good length (${wordCount} words)`,
      });
    } else if (wordCount > 50) {
      newScore += 5;
      newGeneralChecks.push({
        label: "Content Length",
        status: "warning",
        message: `Too short (${wordCount} words, aim for 300+)`,
      });
    } else {
      newGeneralChecks.push({
        label: "Content",
        status: "error",
        message: "Content is missing or too short",
      });
    }

    // 5. Featured Image
    if (data.image) {
      newScore += 10;
      newGeneralChecks.push({
        label: "Featured Image",
        status: "success",
        message: "Image present",
      });
    } else {
      newGeneralChecks.push({
        label: "Featured Image",
        status: "error",
        message: "Missing featured image",
      });
    }

    // 6. Tags/Categories
    if (data.tagIds.length > 0) {
      newScore += 5;
      newGeneralChecks.push({
        label: "Keywords/Tags",
        status: "success",
        message: `${data.tagIds.length} tags selected`,
      });
    } else {
      newGeneralChecks.push({
        label: "Keywords/Tags",
        status: "warning",
        message: "No tags selected",
      });
    }

    if (data.categoryIds.length > 0) {
      newScore += 5;
      newGeneralChecks.push({
        label: "Category",
        status: "success",
        message: "Category selected",
      });
    } else {
      newGeneralChecks.push({
        label: "Category",
        status: "error",
        message: "No category selected",
      });
    }

    // --- Keyword Analysis & Detection ---

    // Prepare full text
    const fullContentForAnalysis =
      `${data.title} ${data.description} ${plainTextContent}`.toLowerCase();

    // Split and count words
    const allWords = fullContentForAnalysis
      .replace(/[^\w\s]/g, "") // Remove punctuation
      .split(/\s+/) // Split by whitespace
      .filter((w) => w.length > 2 && !STOP_WORDS.has(w)); // Filter short & stop words

    const totalWordsForAnalysis = fullContentForAnalysis
      .split(/\s+/) // Split by whitespace
      .filter((w) => w.length > 0).length;

    const wordCounts: Record<string, number> = {};
    allWords.forEach((word) => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });

    const topKeywords = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5) // Top 5
      .map(([word, count]) => ({
        word,
        count,
        density:
          totalWordsForAnalysis > 0 ? (count / totalWordsForAnalysis) * 100 : 0,
      }));

    setDetectedKeywords(topKeywords);

    // --- Keyword Checks (Focus Keyword) ---
    if (focusKeyword.trim()) {
      const keyword = focusKeyword.trim().toLowerCase();
      let keywordScore = 0;

      // Check in Title
      if (data.title.toLowerCase().includes(keyword)) {
        keywordScore += 10;
        newKeywordChecks.push({
          label: "In Title",
          status: "success",
          message: "Keyword found in title",
        });
      } else {
        newKeywordChecks.push({
          label: "In Title",
          status: "warning",
          message: "Keyword not found in title",
        });
      }

      // Check in Description
      if (data.description.toLowerCase().includes(keyword)) {
        keywordScore += 5;
        newKeywordChecks.push({
          label: "In Description",
          status: "success",
          message: "Keyword found in description",
        });
      } else {
        newKeywordChecks.push({
          label: "In Description",
          status: "warning",
          message: "Keyword not found in description",
        });
      }

      // Check Density & Stuffing (Full Content: Title + Desc + Body)
      const keywordCount = (
        fullContentForAnalysis.match(new RegExp(escapeRegExp(keyword), "g")) ||
        []
      ).length;

      const density =
        totalWordsForAnalysis > 0
          ? (keywordCount / totalWordsForAnalysis) * 100
          : 0;

      if (keywordCount > 0) {
        if (density > 2.5) {
          // Stuffing
          newKeywordChecks.push({
            label: "Keyword Stuffing",
            status: "error",
            message: `Density too high (${density.toFixed(1)}%). Detected in Title, Desc, & Content.`,
          });
        } else if (density < 0.5) {
          keywordScore += 5;
          newKeywordChecks.push({
            label: "Keyword Density",
            status: "warning",
            message: `Density low (${density.toFixed(1)}%).`,
          });
        } else {
          keywordScore += 10;
          newKeywordChecks.push({
            label: "Keyword Density",
            status: "success",
            message: `Good density (${density.toFixed(1)}%)`,
          });
        }
      } else {
        newKeywordChecks.push({
          label: "Keyword Presence",
          status: "error",
          message: "Keyword not found in any content",
        });
      }

      newScore += keywordScore;
    } else {
      newKeywordChecks.push({
        label: "Focus Keyword",
        status: "warning",
        message: "Set a focus keyword to analyze density and staffing.",
      });
    }

    setScore(Math.min(newScore, 100));
    setGeneralChecks(newGeneralChecks);
    setKeywordChecks(newKeywordChecks);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className="h-full border-none shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center">
          <h3 className="font-mono text-secondary-foreground py-1 rounded-md text-2xl font-bold">
            <IconSeo className="inline flex items-center " size={44} /> Status
          </h3>
          <span
            className={cn(
              "text-sm px-2 py-1 rounded-full text-white font-bold",
              getScoreColor(score),
            )}
          >
            {score}/100
          </span>
        </CardTitle>
        <CardDescription>
          Optimize your article for search engines
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress
          value={score}
          className="h-2"
        />

        <Tabs defaultValue="seo-status" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="seo-status">SEO Status</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
          </TabsList>

          <TabsContent value="seo-status" className="space-y-3 mt-4">
            {generalChecks.map((check, index) => (
              <div key={index} className="flex items-start gap-3 text-sm">
                <div className="mt-0.5">
                  {check.status === "success" && (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  )}
                  {check.status === "warning" && (
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                  )}
                  {check.status === "error" && (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{check.label}</p>
                  <p className="text-muted-foreground text-xs">
                    {check.message}
                  </p>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="keywords" className="space-y-4 mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="focus-keyword" className="text-sm font-medium">
                  Focus Keyword
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Enter the main keyword you want to rank for.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="focus-keyword"
                placeholder="e.g. Artificial Intelligence"
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                className="h-8 text-sm"
              />
            </div>

            {/* Keyword Difficulty Info Section */}
            <div className="rounded-md bg-muted/10 p-3 text-xs">
              <div className="flex items-center gap-2 font-medium mb-1">
                <Info className="h-3.5 w-3.5 text-blue-500" />
                <span>Keyword Difficulty (KD)</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                KD is an SEO metric measuring how challenging it is to rank on
                the first page of search engine results for a specific term.
              </p>
              {focusKeyword && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-muted-foreground">
                    Estimated Difficulty:
                  </span>
                  <span className="font-semibold text-muted-foreground">
                    N/A (External Tool Required)
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Content Analysis</h4>
              {keywordChecks.map((check, index) => (
                <div key={index} className="flex items-start gap-3 text-sm">
                  <div className="mt-0.5">
                    {check.status === "success" && (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    )}
                    {check.status === "warning" && (
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                    )}
                    {check.status === "error" && (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{check.label}</p>
                    <p className="text-muted-foreground text-xs">
                      {check.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {detectedKeywords.length > 0 && (
              <div className="space-y-2 mt-4 pt-4 border-t">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  Auto-detected Keywords
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3 w-3 text-muted-foreground cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>
                          Top frequent words found in content (excluding stop
                          words). Helps identify potential stuffing.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </h4>
                <div className="space-y-2">
                  {detectedKeywords.map((k, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs border rounded p-2 bg-muted/20"
                    >
                      <span className="font-medium">"{k.word}"</span>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">
                          {k.count}x
                        </span>
                        <div
                          className={cn(
                            "px-1.5 py-0.5 rounded font-bold",
                            k.density > 2.5
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700",
                          )}
                        >
                          {k.density.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
