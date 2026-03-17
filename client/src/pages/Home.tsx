import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2, AlertCircle, Upload, X, FileText } from "lucide-react";
import { toast } from "sonner";

/**
 * Design Philosophy: Minimalist Professional
 * - Clean white background with slate blue accents
 * - Clear section separation with ample whitespace
 * - Easy-to-understand form for non-developers
 * - Comprehensive data for developers to estimate costs and resources
 */

interface FormData {
  // Basic Information
  projectName: string;
  company: string;
  requesterName: string;
  email: string;
  phone: string;

  // Project Overview
  projectType: string;
  projectCategory: string;
  existingSystemDescription: string;

  // Project Scope
  expectedPages: string;
  userRoles: string;
  expectedUsers: string;
  needsMultilingual: string;
  needsResponsive: string;

  // Key Features
  features: string[];
  featureOther: string;
  integrations: string[];
  integrationOther: string;

  // Design Requirements
  hasDesign: string;
  referenceUrls: string;
  designPreference: string;

  // Schedule & Budget
  preferredStartDate: string;
  deadline: string;
  deadlineFlexibility: string;
  budgetRange: string;
  needsMaintenance: string;

  // Detailed Requirements
  projectDescription: string;
  techPreference: string;
  additionalRequests: string;

  // Attached Files
  attachedFiles: { name: string; size: string }[];
}

const featureOptions = [
  "사용자 인증/로그인",
  "결제 시스템",
  "실시간 알림",
  "데이터 분석/대시보드",
  "파일 업로드/관리",
  "검색 기능",
  "게시판/커뮤니티",
  "예약/스케줄링",
  "채팅/메시지",
  "관리자 페이지",
  "기타",
];

const integrationOptions = [
  "PG 결제 (토스/이니시스 등)",
  "소셜 로그인 (카카오/네이버/구글)",
  "SMS/알림톡 (카카오톡 등)",
  "이메일 발송",
  "지도/위치 서비스",
  "외부 API 연동",
  "기타",
];

const INITIAL_FORM_DATA: FormData = {
  projectName: "",
  company: "",
  requesterName: "",
  email: "",
  phone: "",
  projectType: "",
  projectCategory: "",
  existingSystemDescription: "",
  expectedPages: "",
  userRoles: "",
  expectedUsers: "",
  needsMultilingual: "",
  needsResponsive: "",
  features: [],
  featureOther: "",
  integrations: [],
  integrationOther: "",
  hasDesign: "",
  referenceUrls: "",
  designPreference: "",
  preferredStartDate: "",
  deadline: "",
  deadlineFlexibility: "",
  budgetRange: "",
  needsMaintenance: "",
  projectDescription: "",
  techPreference: "",
  additionalRequests: "",
  attachedFiles: [],
};

export default function Home() {
  const [formData, setFormData] = useState<FormData>({ ...INITIAL_FORM_DATA });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.projectName.trim()) newErrors.projectName = "프로젝트명은 필수입니다";
    if (!formData.requesterName.trim()) newErrors.requesterName = "요청자명은 필수입니다";
    if (!formData.email.trim()) newErrors.email = "이메일은 필수입니다";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "유효한 이메일 형식이 아닙니다";
    }
    if (!formData.projectType) newErrors.projectType = "프로젝트 유형은 필수입니다";
    if (!formData.projectCategory) newErrors.projectCategory = "프로젝트 성격은 필수입니다";
    if (!formData.projectDescription.trim()) newErrors.projectDescription = "프로젝트 설명은 필수입니다";
    if (formData.projectDescription.trim().length < 20) {
      newErrors.projectDescription = "프로젝트 설명은 최소 20자 이상이어야 합니다";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleArrayToggle = (
    field: "features" | "integrations",
    value: string
  ) => {
    setFormData((prev) => {
      const current = prev[field] as string[];
      if (current.includes(value)) {
        return {
          ...prev,
          [field]: current.filter((item) => item !== value),
          ...(field === "features" && value === "기타" ? { featureOther: "" } : {}),
          ...(field === "integrations" && value === "기타" ? { integrationOther: "" } : {}),
        };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("필수 항목을 모두 입력해주세요");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Log form data for developer
      console.log("Development Request Form Data:", formData);

      // Create downloadable JSON
      const dataStr = JSON.stringify(formData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `dev-request-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsSubmitted(true);
      toast.success("요청이 제출되었습니다!");

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({ ...INITIAL_FORM_DATA });
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      toast.error("요청 제출 중 오류가 발생했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-12 pb-12 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">요청이 제출되었습니다!</h2>
            <p className="text-muted-foreground mb-6">
              개발자가 곧 연락드릴 예정입니다. 감사합니다.
            </p>
            <p className="text-sm text-muted-foreground">
              페이지가 자동으로 초기화됩니다...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-3">개발 요청 폼</h1>
          <p className="text-lg text-muted-foreground">
            프로젝트에 대해 알려주시면, 정확한 견적과 일정을 안내드립니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">기본 정보</CardTitle>
              <CardDescription>요청자의 기본 정보를 입력해주세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="projectName" className="font-semibold mb-2 block">
                  프로젝트명 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="projectName"
                  placeholder="예: 전자상거래 플랫폼"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  className={errors.projectName ? "border-red-500" : ""}
                />
                {errors.projectName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.projectName}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="company" className="font-semibold mb-2 block">
                  소속 / 회사명 <span className="text-gray-400">(선택)</span>
                </Label>
                <Input
                  id="company"
                  placeholder="예: (주)홍길동컴퍼니"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="requesterName" className="font-semibold mb-2 block">
                    요청자명 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="requesterName"
                    placeholder="홍길동"
                    value={formData.requesterName}
                    onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
                    className={errors.requesterName ? "border-red-500" : ""}
                  />
                  {errors.requesterName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.requesterName}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="font-semibold mb-2 block">
                    이메일 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="phone" className="font-semibold mb-2 block">
                  전화번호 <span className="text-gray-400">(선택)</span>
                </Label>
                <Input
                  id="phone"
                  placeholder="010-1234-5678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Project Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">프로젝트 개요</CardTitle>
              <CardDescription>프로젝트의 유형과 성격을 알려주세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="projectType" className="font-semibold mb-2 block">
                  프로젝트 유형 <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.projectType} onValueChange={(value) => setFormData({ ...formData, projectType: value })}>
                  <SelectTrigger id="projectType" className={errors.projectType ? "border-red-500" : ""}>
                    <SelectValue placeholder="프로젝트 유형을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">웹사이트 구축</SelectItem>
                    <SelectItem value="webapp">웹 애플리케이션</SelectItem>
                    <SelectItem value="mobile">모바일 앱</SelectItem>
                    <SelectItem value="desktop">데스크톱 애플리케이션</SelectItem>
                    <SelectItem value="backend">API/백엔드 개발</SelectItem>
                    <SelectItem value="other">기타</SelectItem>
                  </SelectContent>
                </Select>
                {errors.projectType && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.projectType}
                  </p>
                )}
              </div>

              <div>
                <Label className="font-semibold mb-3 block">
                  프로젝트 성격 <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={formData.projectCategory}
                  onValueChange={(value) => setFormData({ ...formData, projectCategory: value, existingSystemDescription: value === "new" ? "" : formData.existingSystemDescription })}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="new" id="cat-new" />
                    <Label htmlFor="cat-new" className="cursor-pointer font-normal">신규 개발 - 처음부터 새로 만드는 프로젝트</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="improve" id="cat-improve" />
                    <Label htmlFor="cat-improve" className="cursor-pointer font-normal">기존 시스템 개선 - 이미 운영 중인 시스템에 기능 추가/수정</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="renewal" id="cat-renewal" />
                    <Label htmlFor="cat-renewal" className="cursor-pointer font-normal">리뉴얼 - 기존 시스템을 새로운 기술로 재구축</Label>
                  </div>
                </RadioGroup>
                {errors.projectCategory && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.projectCategory}
                  </p>
                )}
              </div>

              {(formData.projectCategory === "improve" || formData.projectCategory === "renewal") && (
                <div>
                  <Label htmlFor="existingSystemDescription" className="font-semibold mb-2 block">
                    기존 시스템 설명
                  </Label>
                  <Textarea
                    id="existingSystemDescription"
                    placeholder="현재 사용 중인 시스템의 URL, 기술 스택, 주요 문제점, 데이터 이관 필요 여부 등을 알려주세요"
                    value={formData.existingSystemDescription}
                    onChange={(e) => setFormData({ ...formData, existingSystemDescription: e.target.value })}
                    rows={3}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 3: Project Scope */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">프로젝트 규모 파악</CardTitle>
              <CardDescription>정확한 견적 산정을 위해 규모를 알려주세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="font-semibold mb-3 block">예상 페이지/화면 수</Label>
                <RadioGroup
                  value={formData.expectedPages}
                  onValueChange={(value) => setFormData({ ...formData, expectedPages: value })}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1-5" id="pages-1" />
                    <Label htmlFor="pages-1" className="cursor-pointer font-normal">5개 이하 (랜딩페이지, 소개 사이트 등)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="6-15" id="pages-2" />
                    <Label htmlFor="pages-2" className="cursor-pointer font-normal">6~15개 (소규모 서비스)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="16-30" id="pages-3" />
                    <Label htmlFor="pages-3" className="cursor-pointer font-normal">16~30개 (중규모 서비스)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="30+" id="pages-4" />
                    <Label htmlFor="pages-4" className="cursor-pointer font-normal">30개 이상 (대규모 플랫폼)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="font-semibold mb-3 block">사용자 유형 수</Label>
                <p className="text-sm text-muted-foreground mb-3">역할별로 다른 화면이나 권한이 필요한 사용자 유형의 수</p>
                <RadioGroup
                  value={formData.userRoles}
                  onValueChange={(value) => setFormData({ ...formData, userRoles: value })}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="roles-1" />
                    <Label htmlFor="roles-1" className="cursor-pointer font-normal">1가지 (일반 사용자만)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="roles-2" />
                    <Label htmlFor="roles-2" className="cursor-pointer font-normal">2가지 (예: 일반 사용자 + 관리자)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3+" id="roles-3" />
                    <Label htmlFor="roles-3" className="cursor-pointer font-normal">3가지 이상 (예: 사용자 + 판매자 + 관리자)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="font-semibold mb-3 block">예상 사용자 수</Label>
                <RadioGroup
                  value={formData.expectedUsers}
                  onValueChange={(value) => setFormData({ ...formData, expectedUsers: value })}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="~100" id="users-1" />
                    <Label htmlFor="users-1" className="cursor-pointer font-normal">100명 이하 (사내용, 소규모)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="~1000" id="users-2" />
                    <Label htmlFor="users-2" className="cursor-pointer font-normal">100~1,000명</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="~10000" id="users-3" />
                    <Label htmlFor="users-3" className="cursor-pointer font-normal">1,000~10,000명</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="10000+" id="users-4" />
                    <Label htmlFor="users-4" className="cursor-pointer font-normal">10,000명 이상 (대규모 서비스)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="font-semibold mb-3 block">다국어 지원 필요</Label>
                  <RadioGroup
                    value={formData.needsMultilingual}
                    onValueChange={(value) => setFormData({ ...formData, needsMultilingual: value })}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="multilingual-no" />
                      <Label htmlFor="multilingual-no" className="cursor-pointer font-normal">한국어만</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="multilingual-yes" />
                      <Label htmlFor="multilingual-yes" className="cursor-pointer font-normal">다국어 지원 필요</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="font-semibold mb-3 block">모바일 반응형 필요</Label>
                  <RadioGroup
                    value={formData.needsResponsive}
                    onValueChange={(value) => setFormData({ ...formData, needsResponsive: value })}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="responsive-no" />
                      <Label htmlFor="responsive-no" className="cursor-pointer font-normal">PC만 지원</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="responsive-yes" />
                      <Label htmlFor="responsive-yes" className="cursor-pointer font-normal">모바일 대응 필요</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Key Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">주요 기능 요구사항</CardTitle>
              <CardDescription>필요한 기능을 모두 선택해주세요 (선택)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="font-semibold mb-3 block">핵심 기능</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {featureOptions.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={`feature-${feature}`}
                        checked={formData.features.includes(feature)}
                        onCheckedChange={() => handleArrayToggle("features", feature)}
                      />
                      <Label htmlFor={`feature-${feature}`} className="cursor-pointer font-normal">
                        {feature}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {formData.features.includes("기타") && (
                <div>
                  <Label htmlFor="featureOther" className="font-semibold mb-2 block">
                    기타 기능 상세
                  </Label>
                  <Input
                    id="featureOther"
                    placeholder="필요한 기능을 입력해주세요"
                    value={formData.featureOther}
                    onChange={(e) => setFormData({ ...formData, featureOther: e.target.value })}
                  />
                </div>
              )}

              <div>
                <Label className="font-semibold mb-3 block">외부 서비스 연동</Label>
                <p className="text-sm text-muted-foreground mb-3">연동이 필요한 외부 서비스를 선택해주세요</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {integrationOptions.map((integration) => (
                    <div key={integration} className="flex items-center space-x-2">
                      <Checkbox
                        id={`integration-${integration}`}
                        checked={formData.integrations.includes(integration)}
                        onCheckedChange={() => handleArrayToggle("integrations", integration)}
                      />
                      <Label htmlFor={`integration-${integration}`} className="cursor-pointer font-normal">
                        {integration}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {formData.integrations.includes("기타") && (
                <div>
                  <Label htmlFor="integrationOther" className="font-semibold mb-2 block">
                    기타 연동 상세
                  </Label>
                  <Input
                    id="integrationOther"
                    placeholder="연동이 필요한 서비스를 입력해주세요"
                    value={formData.integrationOther}
                    onChange={(e) => setFormData({ ...formData, integrationOther: e.target.value })}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 5: Design Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">디자인 요구사항</CardTitle>
              <CardDescription>디자인 관련 정보를 입력해주세요 (선택)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="hasDesign" className="font-semibold mb-2 block">
                  디자인 제공 여부
                </Label>
                <Select value={formData.hasDesign} onValueChange={(value) => setFormData({ ...formData, hasDesign: value })}>
                  <SelectTrigger id="hasDesign">
                    <SelectValue placeholder="선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">예, 디자인이 있습니다</SelectItem>
                    <SelectItem value="partial">일부만 있습니다</SelectItem>
                    <SelectItem value="no">아니오, 디자인이 필요합니다</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="referenceUrls" className="font-semibold mb-2 block">
                  참고 사이트 <span className="text-gray-400">(선택)</span>
                </Label>
                <Textarea
                  id="referenceUrls"
                  placeholder="참고할 사이트 URL을 입력해주세요 (줄바꿈으로 구분)"
                  value={formData.referenceUrls}
                  onChange={(e) => setFormData({ ...formData, referenceUrls: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="designPreference" className="font-semibold mb-2 block">
                  디자인 선호도 <span className="text-gray-400">(선택)</span>
                </Label>
                <Select value={formData.designPreference} onValueChange={(value) => setFormData({ ...formData, designPreference: value })}>
                  <SelectTrigger id="designPreference">
                    <SelectValue placeholder="선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">미니멀</SelectItem>
                    <SelectItem value="modern">모던</SelectItem>
                    <SelectItem value="classic">클래식</SelectItem>
                    <SelectItem value="other">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Section 6: Schedule & Budget */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">일정 및 예산</CardTitle>
              <CardDescription>선호하는 일정과 예산을 알려주세요 (선택)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="preferredStartDate" className="font-semibold mb-2 block">
                    희망 시작일
                  </Label>
                  <Input
                    id="preferredStartDate"
                    type="date"
                    value={formData.preferredStartDate}
                    onChange={(e) => setFormData({ ...formData, preferredStartDate: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="deadline" className="font-semibold mb-2 block">
                    희망 완료일
                  </Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label className="font-semibold mb-3 block">일정 유연성</Label>
                <RadioGroup
                  value={formData.deadlineFlexibility}
                  onValueChange={(value) => setFormData({ ...formData, deadlineFlexibility: value })}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hard" id="flex-hard" />
                    <Label htmlFor="flex-hard" className="cursor-pointer font-normal">반드시 맞춰야 합니다 (출시일, 이벤트 등)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="flexible" id="flex-flexible" />
                    <Label htmlFor="flex-flexible" className="cursor-pointer font-normal">어느 정도 조정 가능합니다</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="flex-none" />
                    <Label htmlFor="flex-none" className="cursor-pointer font-normal">특별한 마감일은 없습니다</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="budgetRange" className="font-semibold mb-2 block">
                  예산 범위
                </Label>
                <Select value={formData.budgetRange} onValueChange={(value) => setFormData({ ...formData, budgetRange: value })}>
                  <SelectTrigger id="budgetRange">
                    <SelectValue placeholder="선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-100">100만원 미만</SelectItem>
                    <SelectItem value="100-500">100만원 ~ 500만원</SelectItem>
                    <SelectItem value="500-1000">500만원 ~ 1,000만원</SelectItem>
                    <SelectItem value="1000-2000">1,000만원 ~ 2,000만원</SelectItem>
                    <SelectItem value="2000-5000">2,000만원 ~ 5,000만원</SelectItem>
                    <SelectItem value="5000+">5,000만원 이상</SelectItem>
                    <SelectItem value="negotiable">협의 필요</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="font-semibold mb-3 block">개발 완료 후 운영/유지보수 필요</Label>
                <RadioGroup
                  value={formData.needsMaintenance}
                  onValueChange={(value) => setFormData({ ...formData, needsMaintenance: value })}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="maint-yes" />
                    <Label htmlFor="maint-yes" className="cursor-pointer font-normal">예, 운영/유지보수도 함께 맡기고 싶습니다</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="maint-no" />
                    <Label htmlFor="maint-no" className="cursor-pointer font-normal">아니오, 개발만 필요합니다</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="undecided" id="maint-undecided" />
                    <Label htmlFor="maint-undecided" className="cursor-pointer font-normal">아직 미정입니다</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Section 7: Detailed Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">상세 요구사항</CardTitle>
              <CardDescription>프로젝트에 대해 자세히 설명해주세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="projectDescription" className="font-semibold mb-2 block">
                  프로젝트 설명 <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="projectDescription"
                  placeholder="프로젝트의 목표, 주요 기능, 타겟 사용자 등을 자세히 설명해주세요 (최소 20자)"
                  value={formData.projectDescription}
                  onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                  rows={6}
                  className={errors.projectDescription ? "border-red-500" : ""}
                />
                <div className="flex justify-between items-center mt-2">
                  <div>
                    {errors.projectDescription && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {errors.projectDescription}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{formData.projectDescription.length}자</p>
                </div>
              </div>

              <div>
                <Label htmlFor="techPreference" className="font-semibold mb-2 block">
                  기술 선호도 / 기존 인프라 <span className="text-gray-400">(선택)</span>
                </Label>
                <Textarea
                  id="techPreference"
                  placeholder="선호하는 기술이나 현재 사용 중인 인프라가 있다면 자유롭게 적어주세요 (예: AWS 사용 중, React 선호 등)"
                  value={formData.techPreference}
                  onChange={(e) => setFormData({ ...formData, techPreference: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="additionalRequests" className="font-semibold mb-2 block">
                  추가 요청사항 <span className="text-gray-400">(선택)</span>
                </Label>
                <Textarea
                  id="additionalRequests"
                  placeholder="추가로 요청하고 싶은 사항이 있으면 입력해주세요"
                  value={formData.additionalRequests}
                  onChange={(e) => setFormData({ ...formData, additionalRequests: e.target.value })}
                  rows={4}
                />
              </div>

              {/* File Attachment */}
              <div>
                <Label className="font-semibold mb-2 block">
                  기획문서 / 참고파일 첨부 <span className="text-gray-400">(선택)</span>
                </Label>
                <label
                  htmlFor="fileUpload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
                >
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">클릭하여 파일을 선택하세요</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    PDF, Word, Excel, 이미지, ZIP 등 (최대 10MB)
                  </p>
                </label>
                <input
                  id="fileUpload"
                  type="file"
                  multiple
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.hwp,.txt,.png,.jpg,.jpeg,.gif,.zip,.rar"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (!files) return;
                    const newFiles = Array.from(files).map((file) => ({
                      name: file.name,
                      size:
                        file.size < 1024 * 1024
                          ? `${(file.size / 1024).toFixed(1)}KB`
                          : `${(file.size / (1024 * 1024)).toFixed(1)}MB`,
                    }));
                    setFormData((prev) => ({
                      ...prev,
                      attachedFiles: [...prev.attachedFiles, ...newFiles],
                    }));
                    e.target.value = "";
                  }}
                />

                {formData.attachedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {formData.attachedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between px-3 py-2 bg-muted/50 rounded-md"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span className="text-sm truncate">{file.name}</span>
                          <span className="text-xs text-muted-foreground shrink-0">({file.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              attachedFiles: prev.attachedFiles.filter((_, i) => i !== index),
                            }))
                          }
                          className="text-muted-foreground hover:text-destructive transition-colors ml-2 shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? "제출 중..." : "요청 제출"}
            </Button>
            <Button
              type="reset"
              variant="outline"
              className="flex-1 py-6 text-base"
              onClick={() => {
                setFormData({ ...INITIAL_FORM_DATA });
                setErrors({});
              }}
            >
              초기화
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
