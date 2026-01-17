package com.conchclub.service;

import com.google.api.services.sheets.v4.Sheets;
import com.google.api.services.sheets.v4.model.ValueRange;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Answers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class GoogleSheetsServiceTest {

    @Mock(answer = Answers.RETURNS_DEEP_STUBS)
    private Sheets sheets;

    @InjectMocks
    private GoogleSheetsService googleSheetsService;

    private static final String SPREADSHEET_ID = "test-sheet-id";

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(googleSheetsService, "spreadsheetId", SPREADSHEET_ID);
    }

    @Test
    void readRange_ReturnsValues_WhenSuccessful() throws IOException {
        List<List<Object>> values = Arrays.asList(
                Arrays.asList("Header1", "Header2"),
                Arrays.asList("Val1", "Val2"));
        ValueRange response = new ValueRange().setValues(values);

        when(sheets.spreadsheets().values().get(anyString(), anyString()).execute())
                .thenReturn(response);

        List<List<Object>> result = googleSheetsService.readRange("Sheet1!A1:B2");

        assertThat(result).hasSize(2);
        assertThat(result.get(1).get(0)).isEqualTo("Val1");
    }

    @Test
    void readRange_ThrowsException_WhenApiFails() throws IOException {
        when(sheets.spreadsheets().values().get(anyString(), anyString()).execute())
                .thenThrow(new IOException("API Error"));

        assertThatThrownBy(() -> googleSheetsService.readRange("A1"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Failed to read from Google Sheet");
    }

    @Test
    void writeRow_ExecutesSuccessfully() throws IOException {
        googleSheetsService.writeRow("Sheet1!A1", Collections.singletonList("data"));

        verify(sheets.spreadsheets().values()
                .append(eq(SPREADSHEET_ID), anyString(), any(ValueRange.class))
                .setValueInputOption("USER_ENTERED"))
                .execute();
    }

    @Test
    void updateCell_ExecutesSuccessfully() throws IOException {
        googleSheetsService.updateCell("Sheet1!A1", "new-value");

        verify(sheets.spreadsheets().values()
                .update(eq(SPREADSHEET_ID), anyString(), any(ValueRange.class))
                .setValueInputOption("USER_ENTERED"))
                .execute();
    }
}
